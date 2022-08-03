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
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import post_tweet from "./requests/post_tweet";

import { PrismaClient, Tweet } from "@prisma/client";

const RANDOM_MARKET_CHANCE = 0.2;

const prisma = new PrismaClient();

const msUntilTime = (date: Date): number => {
  var now = new Date() as any;
  var millisTillTime = (date as any) - now;
  return millisTillTime;
};

const marketEvent = async (text: string) => {};

const encounterEvent = async (text: string) => {
  const encounterTweetId = await post_tweet(text);
  if (!encounterTweetId) {
    console.log(
      "[ENCOUNTER TWEET FAILED TO POST (" + new Date().toUTCString() + ")]"
    );
    return;
  }

  const streamFilter = `conversation_id:${encounterTweetId}`;
  const streamTag = `from ${encounterTweetId} conversation`;
};

const handleEventTweet = async (tweet: Tweet) => {};

const handleMessageTweet = async (tweet: Tweet) => {};

const handleRandomEventTweet = async () => {
  if (Math.random() < RANDOM_MARKET_CHANCE) {
  } else {
  }
};

const scheduleTweets = async () => {
  const currentTime = new Date();
  const dayFromNow = new Date();
  dayFromNow.setDate(dayFromNow.getDate() + 1);
  const tweets: Tweet[] = await prisma.tweet.findMany({
    where: {
      schedule: {
        gte: currentTime,
        lt: dayFromNow,
      },
    },
  });

  const eventTweets = tweets.filter((tweet: Tweet) => tweet.type !== "MESSAGE");
  const storyTweets = tweets.filter((tweet: Tweet) => tweet.type === "MESSAGE");

  if (!eventTweets) {
    //if no events scheduled. Schedule a random event between now and tomorrow.
    const msTomorrowStart = msUntilTime(
      new Date(
        currentTime.getFullYear(),
        currentTime.getMonth(),
        currentTime.getDate() + 1,
        0,
        0,
        0
      )
    );
    setTimeout(
      handleRandomEventTweet,
      Math.floor(Math.random() * msTomorrowStart)
    );
  } else {
    eventTweets.forEach((tweet: Tweet) => {
      setTimeout(
        handleEventTweet.bind(null, tweet),
        msUntilTime(tweet.schedule)
      );
    });
  }

  storyTweets.forEach((tweet: Tweet) => {
    setTimeout(handleEventTweet.bind(null, tweet), msUntilTime(tweet.schedule));
  });
};

async function main() {
  console.log("Bot started...");
  //   const dailyTweetScheduler = setInterval(scheduleTweets, 86400000);
  //   const dailyMonumentSceduler = setInterval(scheduleMonument, 86400000);
  await post_tweet("Test 7: base_func");
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
