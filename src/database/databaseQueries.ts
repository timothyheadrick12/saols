import {BattlePrompt, Event, MarketPrompt, User} from '@prisma/client';
import {msUntilReset, resetTimeForDate} from '../time';
import {prisma} from './prismaClientInit';

//desc: Gets all expired events from the database
//post: return Promise<Event[]>
export const getExpiredEvents = async (): Promise<Event[]> => {
  const currentTime = new Date();
  return prisma.event.findMany({
    where: {
      finished: {equals: false},
      started: {equals: true},
      endDateTime: {lte: currentTime},
    },
  });
};

//desc: Gets all events that have started from the database
//post: return Promise<Event[]>
export const getCurrentStartedEvents = async (): Promise<Event[]> => {
  return prisma.event.findMany({
    where: {
      started: {equals: true},
      finished: {equals: false},
    },
  });
};

//desc: Get an ongoing event by id that from the database
//post: return Promise<Event[]>
export const getCurrentStartedEvent = async (id: number) => {
  return prisma.event.findFirst({
    where: {
      id: id,
      started: true,
      finished: false,
    },
  });
};

//desc: Gets all events that should be started but are not from the database
//post: return Promise<Event[]>
export const getCurrentUnstartedEvents = async (): Promise<Event[]> => {
  const currentTime = new Date();
  return prisma.event.findMany({
    where: {
      started: {equals: false},
      endDateTime: {gt: currentTime},
      startDateTime: {lte: currentTime},
    },
  });
};

//desc: Gets all events that have not started but will be today
//post: return Promise<Event[]>
export const getEventsStartingToday = async (): Promise<Event[]> => {
  const currentTime = new Date();
  return prisma.event.findMany({
    where: {
      started: {equals: false},
      finished: {equals: false},
      startDateTime: {gt: currentTime, lte: resetTimeForDate(currentTime)},
    },
  });
};

//desc: Get a random prompt for a market event
//post: return Promise<Event[]>
export const randomMarketPrompt = async (): Promise<MarketPrompt | null> => {
  const numPrompts = await prisma.marketPrompt.count();
  return prisma.marketPrompt.findFirst({
    skip: Math.floor(Math.random() * numPrompts),
  });
};

//desc: Gets a random prompt for an encounter event
//post: return Promise<Event[]>
export const randomEncounterPrompt = async (): Promise<BattlePrompt | null> => {
  const numPrompts = await prisma.battlePrompt.count();
  return prisma.battlePrompt.findFirst({
    skip: Math.floor(Math.random() * numPrompts),
  });
};

//desc: Gets all the moderators from the database
//post: return Promise<Event[]>
export const getModerators = async (): Promise<User[] | null> => {
  return prisma.user.findMany({
    where: {
      moderator: {equals: true},
    },
  });
};

//desc: Get a user from their unique id
//post: return Promise<User>
export const getUser = async (id: string): Promise<ExpandedUser | null> => {
  return prisma.user.findUnique({
    where: {
      id: id,
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
      items: true,
      weaponInventory: true,
    },
  });
};

/**
 * Desc: Get the parCor object for a given level.
 * @param level
 * @returns Promise<parCor>
 */
export const getParCor = async (level: number) => {
  return prisma.parCor.findUnique({
    where: {
      lvl: level,
    },
  });
};

/**
 * Desc: Get the parExp object for a given level.
 * @param level
 * @returns Promise<parExp>
 */
export const getParExp = async (level: number) => {
  return prisma.parUserExp.findUnique({
    where: {
      lvl: level,
    },
  });
};

export const getParWeaponExp = async (level: number) => {
  return prisma.parWeaponExp.findUnique({
    where: {
      lvl: level,
    },
  });
};
