import {BaseWeapon, Item, User, Weapon, WeaponType} from '@prisma/client';
import {getParExp, getParWeaponExp} from '../database/databaseQueries';
import {updateUser} from '../database/databaseUpdates';

export const handleLoot = async (
  user: ExpandedUser,
  cor?: number,
  exp?: number,
  items?: Item[],
  weapons?: Weapon[]
) => {
  if (exp) {
    const weaponTypeCamelCase = weaponTypeToLowerCamelCase(
      user.weapon.BaseWeapon.type
    );
    const weaponTypeExp = `${weaponTypeCamelCase}SkillExp`;
    const weaponTypeLvl = `${weaponTypeCamelCase}SkillLvl`;
    //@ts-ignore this is a massive workaround, can't figure it out for now
    user[weaponTypeExp] += exp;
    await getParWeaponExp(user.lvl).then((expObj) => {
      if (expObj) {
        //@ts-ignore
        if (user[weaponTypeExp] >= expObj!.value) {
          //@ts-ignore
          user[weaponTypeLvl] += 1;
          //@ts-ignore
          user[weaponTypeExp] -= expObj!.value;
        }
      } else {
        console.log(
          `ERROR: The level provided ${user.lvl} has no assciated expObj.`
        );
      }
    });
    user.exp += exp;
    await getParExp(user.lvl).then((expObj) => {
      if (expObj) {
        if (user.exp >= expObj!.value) {
          user.lvl += 1;
          user.exp -= expObj!.value;
        }
      } else {
        console.log(
          `ERROR: The level provided ${user.lvl} has no assciated expObj.`
        );
      }
    });
  }
  user.cor += cor ?? 0;
  if (weapons) {
    weapons.forEach((weapon) => {
      if (weapon.lvl >= user.weapon.lvl) user.weaponId = weapon.id;
    });
    user.weaponInventory.push(...weapons);
  }
  if (items) user.items.push(...items);
  await updateUser(user);
};

/**
 * Desc: Useful for being able to specify the weaponType to modify
 * for User WeaponExp.
 * @param weaponType WeaponType to be converted
 * @returns lowerCamelCase weaponType name
 */
export const weaponTypeToLowerCamelCase = (weaponType: WeaponType): string => {
  return `${weaponType.split('_')[0].toLowerCase()}${weaponType
    .split('_')
    .slice(1)
    .map((word) => `${word.slice(0, 1)}${word.slice(1).toLowerCase()}`)
    .join('')}`;
};
