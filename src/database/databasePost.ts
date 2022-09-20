import {User} from '@prisma/client';
import {prisma} from './prismaClientInit';

export const createRandomEvent = async (event: IMinEvent) => {
  prisma.event.create({
    data: {
      ...event,
      random: true,
      endsAtDailyReset: true,
    },
  });
};

export const createUserDefault = async (
  username: string,
  name: string
): Promise<User> => {
  return prisma.user.create({
    data: {
      username: username,
      name: name,
      weaponId: parseInt(process.env.DEFAULT_WEAPON!),
    },
  });
};
