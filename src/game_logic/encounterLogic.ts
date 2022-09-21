import {Item, User, Weapon} from '@prisma/client';
import {getParCor, getParExp} from '../database/databaseQueries';

const FLOOR = 1;

export const calcForagingCor = (user: User) => {
  getParCor(FLOOR)
    .then((corObj) => {
      return Math.round(corObj!.value * (Math.random() + 1)); //Multiply foraging result by random value between (1,2)
    })
    .catch(() => {
      console.log(
        `Something went wrong while calcing foraging cor for ${user.username}`
      );
    });
};

export const calcForagingExp = (user: User) => {
  getParExp(FLOOR)
    .then((expObj) => {
      return Math.round(expObj!.value * (Math.random() * 0.2 + 0.9)); //Multiply foraging result by random value between (1,2)
    })
    .catch(() => {
      console.log(
        `Something went wrong while calcing foraging exp for ${user.username}`
      );
    });
};
