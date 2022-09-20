import {PrismaClient} from '@prisma/client';
import { eventNames } from 'process';
import { getSourceMapRange } from 'typescript';
import { createUserDefault } from './database/databasePost';
import { getCurrentStartedEvent, getUser } from './database/databaseQueries';

const FLOOR = 1;

export const handleEncounterTweet = async (
  tweet: any,
  prisma: PrismaClient
) => {
  let eventId: number|undefined = undefined
  //get eventId for tweet. There should only be one event
  //rule on each tweet.
  tweet.matching_rules!.forEach(
    (rule: any) => {
      if(rule.tag.indexOf("-") !== -1) {
        eventId = parseInt(rule.tag!.split('-')[1])
        break;
      }
    }
  );
  //if any eventId was retrieved
  if(eventId) {
    const event = await getCurrentStartedEvent(eventId)
    //if that event id has an associated ongoing event
    if(event) {
      //not positive this formatting gets the username
      let user = await getUser(tweet.users[0].username)
      if(!user) {
        user = {...(await createUserDefault(tweet.users[0].username, tweet.users[0].name)), participatedEvents: []}
      }
      const participatedEvents = user.participatedEvents.map((event) => event.id)
      if(participatedEvents.includes(event.id))
      //WORKING HERE
      if (tweet.text.toLowerCase().includes('attack')) {
      } else if (tweet.text.toLowerCase().includes('forage')) {
        const corRecieved = 
      }
    }
  }
  
};

export const handleMarketTweet = async (tweet: any, prisma: PrismaClient) => {};

export const handleBossTweet = async (tweet: any, prisma: PrismaClient) => {};

export const handleModerationTweet = async (
  tweet: any,
  prisma: PrismaClient
) => {};