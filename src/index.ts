/**
 * File: index.ts
 * Desc:
 *
 * Copyright (C) 2022  Timothy Headrick
 *
 * This file is part of saols
 *
 * saols is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * saols is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import path from 'path';
dotenv.config({path: path.resolve(__dirname, '../.env')});

import post_tweet from './requests/post_tweet';

import {PrismaClient, Event} from '@prisma/client';
import {add_rule, stream_connect} from './requests/filtered_stream';
import {sleep} from './sleep';
import {Client, auth} from 'twitter-api-sdk';
import {msUntilReset, msUntilTime} from './time';
import {
  getCurrentStartedEvents,
  getEventsStartingToday,
  getExpiredEvents,
} from './database/databaseQueries';
import {
  createPermanentRule,
  createRandomEvent,
  deleteEventStreamRules,
  permanentRuleActive,
  scheduleEventExpirations,
  scheduleEvents,
  startUnstartedCurrentEvents,
} from './eventManagement';
import {markEventsFinished} from './database/databaseUpdates';
import {
  handleBossTweet,
  handleEncounterTweet,
  handleMarketTweet,
  handleModerationTweet,
} from './tweetHandlers';

const client = new Client(process.env.BEARER_TOKEN!);

const RANDOM_MARKET_CHANCE = 0.2; //chance a market occurs for the random event
let currentEvents: Event[];
let dailyResetInterval: NodeJS.Timer;

const prisma = new PrismaClient();

const dailyReset = async () => {
  //-------MAKE SURE PERMANENT RULE STILL ACTIVE------------------
  if (!(await permanentRuleActive())) {
    await createPermanentRule();
  }

  //-------------------END DAILY RESET EVENTS---------------------
  const expiredEvents = await getExpiredEvents();
  if (expiredEvents.length !== 0) {
    await deleteEventStreamRules(expiredEvents);
    await markEventsFinished(expiredEvents);
  }

  //--------------------START UNSTARTED EVENTS--------------------
  //this shouldn't really happen unless the program crashed and restarted
  await startUnstartedCurrentEvents();

  //-----------------------SCHEDULE EVENTS------------------------
  const eventsStartingToday = await getEventsStartingToday();
  if (eventsStartingToday.length !== 0) scheduleEvents(eventsStartingToday);

  //--------GET CURRENT EVENTS AND SCHEDULE EXPIRATIONS-----------
  const currentEvents = await getCurrentStartedEvents();
  scheduleEventExpirations([...eventsStartingToday, ...currentEvents]);

  //----------------------SCHEDULE RANDOM EVENT-------------------
  if (currentEvents.length === 0 && eventsStartingToday.length === 0) {
    createRandomEvent();
  }
};

const tweetDispatcher = async (tweet: any) => {
  const ruleTags = tweet.matching_rules?.map(
    (rule: any) => rule.tag?.split('-')[0] //only get the all caps identifier for tweet
  );
  if (ruleTags.include('ENCOUNTER')) handleEncounterTweet(tweet);
  else if (ruleTags.include('MARKET')) handleMarketTweet(tweet);
  else if (ruleTags.include('BOSS')) handleBossTweet(tweet);
  else if (ruleTags.include('PERMANENT')) handleModerationTweet(tweet);
};

async function newMain() {
  await dailyReset();
  (async () => {
    const stream = client.tweets.searchStream({
      backfill_minutes: 2,
      expansions: ['author_id'],
    });
    for await (const tweet of stream) {
      console.log(tweet);

      tweetDispatcher(tweet);
    }
  })();
}

async function main() {
  console.log('Bot started...');
  //   const dailyTweetScheduler = setInterval(scheduleTweets, 86400000);
  //   const dailyMonumentSceduler = setInterval(scheduleMonument, 86400000);
  const tweetId = await post_tweet('Test 46: timeout_test');
  const getRules = await client.tweets.getRules();
  if (getRules.data) {
    const ruleIds = getRules.data.map((rule: any) => rule.id);
    await client.tweets.addOrDeleteRules({
      delete: {
        ids: ruleIds,
      },
    });
  }
  const response = await client.tweets.addOrDeleteRules({
    add: [
      {
        value: `conversation_id:${tweetId} #linkstart`,
        tag: `conversation-${tweetId}`,
      },
    ],
  });
  await sleep(3000);
  console.log(await client.tweets.getRules());
  setTimeout(() => console.log('Hey it worked!'), 20000);
  (async () => {
    const stream = client.tweets.searchStream({
      expansions: ['author_id'],
    });
    for await (const tweet of stream) {
      console.log(tweet);
    }
  })();
  console.log('HERE');

  // ... you will write your Prisma Client queries here
}

const scheduleMonument = async () => {};

main()
  .then(async () => {
    await prisma.$disconnect();
  })

  .catch(async (e) => {
    console.error(e);

    await prisma.$disconnect();

    process.exit(1);
  });
