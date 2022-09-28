import {Event, Item, User, Weapon} from '@prisma/client';
import {prisma} from './prismaClientInit';

export const markEventsFinished = async (events: Event[]) => {
  const ids = events.map((event: Event) => event.id);
  prisma.event.updateMany({
    where: {id: {in: ids}},
    data: {finished: true},
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

/**
 * Desc: Updates a user's name and username. Useful for when they
 * change their display name or username.
 * @param id The id of the user to be updated
 * @param name The optional new display name of the user
 * @param username The optional new username of the user
 */
export const updateNames = async (
  user: User,
  name?: string,
  username?: string
) => {
  prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      username: username ?? user.username,
      name: name ?? user.name,
    },
  });
};

export const updateUser = async (user: User) => {
  prisma.user.update({
    where: {
      id: user.id,
    },
    data: user,
  });
};
