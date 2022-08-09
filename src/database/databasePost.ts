import { prisma } from "./prismaClientInit";

export const postRandomEvent = async (event: IMinEvent) => {
  prisma.event.create({
    data: {
      ...event,
      random: true,
      endsAtDailyReset: true,
    },
  });
};
