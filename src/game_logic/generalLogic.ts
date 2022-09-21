import {Item, User, Weapon} from '@prisma/client';
import {getParExp} from '../database/databaseQueries';

export const handleLoot = (
  user: User,
  cor?: number,
  exp?: number,
  items?: Item[],
  weapon?: Weapon[]
) => {
  if (exp) {
    let lvl = user.lvl;
    exp += user.exp;
    getParExp(user.lvl).then((expObj) => {
      if (exp! >= expObj!.value) {
        lvl += 1;
        exp! -= expObj!.value;
      }
    });
  }
};
