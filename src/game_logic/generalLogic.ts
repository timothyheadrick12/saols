import {BaseWeapon, Item, User, Weapon, WeaponType} from '@prisma/client';
import {getParExp} from '../database/databaseQueries';

export const handleLoot = async (
  user: ExpandedUser,
  cor?: number,
  exp?: number,
  items?: Item[],
  weapon?: Weapon[]
) => {
  if (exp) {
    user.exp += exp;
    const weaponTypeCamelCase = weaponTypeToLowerCamelCase(
      user.weapon.BaseWeapon.type
    );
    const weaponTypeExp = `${weaponTypeCamelCase}SkillExp`;
    const weaponTypeLvl = `${weaponTypeCamelCase}SkillLvl`;
    if (hasKey(user, weaponTypeExp)) {
      user.weaponTypeExp += exp; //needs work
    }
    getParExp(user.lvl).then((expObj) => {
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

export const hasKey = <T>(type: T, key: PropertyKey): key is keyof T =>
  key in type;
