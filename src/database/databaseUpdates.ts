import { Event } from "@prisma/client";
import { prisma } from "./prismaClientInit";

export const markEventsFinished = async (events: Event[]) => {
  const ids = events.map((event: Event) => event.id);
  prisma.event.updateMany({
    where: { id: { in: ids } },
    data: { finished: true },
  });
};

/**
 * Desc: Marks an event as started, which requires also setting the stream ruleId associated
 * with the event once it has been created
 * @param event The event to mark as started
 * @param tweetId The id of the tweet associated with the event
 * @param ruleId The id of the stream rule associated with the event
 */
export const markEventStarted = async (
  event: Event,
  tweetId: string,
  ruleId: string
) => {
  prisma.event.update({
    where: {
      id: event.id,
    },
    data: {
      started: true,
      tweetId: tweetId,
      tweetStreamRuleId: ruleId,
    },
  });
};
