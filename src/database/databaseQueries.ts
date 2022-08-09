import { BattlePrompt, Event, MarketPrompt } from "@prisma/client";
import { msUntilReset, resetTimeForDate } from "../time";
import { prisma } from "./prismaClientInit";

export const getExpiredEvents = async (): Promise<Event[]> => {
  const currentTime = new Date();
  return prisma.event.findMany({
    where: {
      finished: { equals: false },
      started: { equals: true },
      endDateTime: { lte: currentTime },
    },
  });
};

export const getCurrentStartedEvents = async (): Promise<Event[]> => {
  const currentTime = new Date();
  return prisma.event.findMany({
    where: {
      started: { equals: true },
      finished: { equals: false },
    },
  });
};

export const getCurrentUnstartedEvents = async (): Promise<Event[]> => {
  const currentTime = new Date();
  return prisma.event.findMany({
    where: {
      started: { equals: false },
      endDateTime: { gt: currentTime },
      startDateTime: { lte: currentTime },
    },
  });
};

export const getEventsStartingToday = async (): Promise<Event[]> => {
  const currentTime = new Date();
  return prisma.event.findMany({
    where: {
      started: { equals: false },
      finished: { equals: false },
      startDateTime: { gt: currentTime, lte: resetTimeForDate(currentTime) },
    },
  });
};

export const randomMarketPrompt = async (): Promise<MarketPrompt | null> => {
  const numPrompts = await prisma.marketPrompt.count();
  return prisma.marketPrompt.findFirst({
    skip: Math.floor(Math.random() * numPrompts),
  });
};

export const randomEncounterPrompt = async (): Promise<BattlePrompt | null> => {
  const numPrompts = await prisma.battlePrompt.count();
  return prisma.battlePrompt.findFirst({
    skip: Math.floor(Math.random() * numPrompts),
  });
};
