import {Event} from '@prisma/client';
import {
  getCurrentUnstartedEvents,
  getModerators,
  randomEncounterPrompt,
  randomMarketPrompt,
} from './database/databaseQueries';
import {markEventsFinished, markEventStarted} from './database/databaseUpdates';
import {client} from './requests/apiClientInit';
import post_tweet from './requests/post_tweet';
import {msUntilReset, msUntilTime, resetTimeForDate} from './time';

const RANDOM_MARKET_CHANCE = 0.2; //chance a market occurs for the random event

export const deleteEventStreamRules = async (events: Event[]) => {
  try {
    const ruleIds = events.map((event: Event) => event.tweetStreamRuleId!);
    return client.tweets.addOrDeleteRules({
      delete: {
        ids: ruleIds,
      },
    });
  } catch {
    console.log(
      'Something went wrong while trying to remove event rules from stream. Did those events include streamRuleIds?'
    );
  }
};

//TODO: Need to handle bosses and messages differently
export const startEvent = async (event: Event) => {
  const tweetId = await post_tweet(event.tweetText);
  const response = await client.tweets.addOrDeleteRules({
    add: [
      {
        value: `conversation_id:${tweetId} ${
          event.customHashtag ?? '#linkstart'
        }`,
        tag: `${event.type}-${event.id}`,
      },
    ],
  });
  try {
    markEventStarted(event, tweetId!, response.data![0].id!);
  } catch {
    console.log(
      `Something went wrong while reading add rule response of ${event.type}-${event.id}`
    );
  }
};

export const scheduleEvents = async (events: Event[]) => {
  events.forEach((event: Event) => {
    setTimeout(startEvent.bind(null, event), msUntilTime(event.startDateTime));
  });
};

export const endEvent = async (event: Event) => {
  try {
    await client.tweets.addOrDeleteRules({
      delete: {
        ids: [event.tweetStreamRuleId!],
      },
    });
    markEventsFinished([event]);
  } catch {
    console.log(
      'Something went wrong while trying to remove a scheduled event expiration from stream. Did that event include streamRuleIds?'
    );
  }
};

export const scheduleEventExpirations = async (events: Event[]) => {
  events.forEach((event: Event) => {
    if (event.endDateTime < resetTimeForDate(new Date())) {
      setTimeout(endEvent.bind(null, event), msUntilTime(event.endDateTime));
    }
  });
};

export const startUnstartedCurrentEvents = async () => {
  const unstartedEvents = await getCurrentUnstartedEvents();
  unstartedEvents.forEach((event: Event) => {
    startEvent(event);
  });
};

export const createRandomEvent = async () => {
  const maxStartDelay = msUntilReset() - 14400000; //4 hours before daily reset
  const startTime =
    (new Date() as any) + Math.floor(maxStartDelay * Math.random()) + 60000; //add a minute just in case startTime is too soon
  const event: IMinEvent = {
    tweetText: '',
    startDateTime: startTime,
    endDateTime: resetTimeForDate(startTime),
    type: 'ENCOUNTER',
  };
  if (Math.random() <= RANDOM_MARKET_CHANCE) {
    const marketPrompt = await randomMarketPrompt();
    event.tweetText = marketPrompt
      ? marketPrompt.text
      : 'You hang around the Town of Beginnings today.'; // in case no prompts are found
    event.type = 'MARKET';
  } else {
    const encounterPrompt = await randomEncounterPrompt();
    event.tweetText = encounterPrompt
      ? encounterPrompt.text
      : 'You wander the fields of Aincrad today.';
    event.type = 'ENCOUNTER';
  }
};

export const permanentRuleActive = async () => {
  const currentRules = await client.tweets.getRules();
  return currentRules.data.some((rule) => (rule.tag = 'PERMANENT-MODERATION'));
};

export const createPermanentRule = async () => {
  const moderators = await getModerators();
  if (moderators) {
    const moderatorUsernameRules = moderators.map(
      (moderator) => `from:${moderator.username}`
    );
    const response = await client.tweets.addOrDeleteRules({
      add: [
        {
          value: `${moderatorUsernameRules.join(
            ' OR '
          )} @SAOls_bot #system_command`,
          tag: `PERMANENT-MODERATION`,
        },
      ],
    });
    console.log(`Error while adding permanent rule: ${response.errors}`);
  }
};
