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
  id: string,
  username: string,
  name: string
): Promise<ExpandedUser> => {
  return prisma.user.create({
    data: {
      id: id,
      username: username,
      name: name,
      weaponId: parseInt(process.env.DEFAULT_WEAPON!),
    },
    include: {
      participatedEvents: {
        select: {
          id: true,
        },
      },
      weapon: {
        include: {
          BaseWeapon: true,
        },
      },
    },
  });
};
