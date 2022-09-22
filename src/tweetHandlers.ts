import {Event, PrismaClient, User} from '@prisma/client';
import {createUserDefault} from './database/databasePost';
import {
  getCurrentStartedEvent,
  getParCor,
  getParExp,
  getUser,
} from './database/databaseQueries';
import {updateNames} from './database/databaseUpdates';

const FLOOR = 1;

/**
 * Desc: Generalized Tweet handler. Gets the User and and event for non-moderation tweets
 * before calling the necessary function to handle the event.
 * @param tweet The tweet recieved
 */
export const handleTweet = async (tweet: any) => {
  const ruleTag: string[] = tweet.matching_rules?.map(
    (rule: any) => rule.tag?.split('-') //only get the all caps identifier for tweet
  );
  //This should only ever be equal to one. If it is not, something has went wrong.
  if (ruleTag.length === 1) {
    //specific handler are awaited to avoid having unnecessary asynchonous depth
    if (ruleTag[0] === 'PERMANENT') await handleModerationTweet(tweet);
    else {
      const eventId = parseInt(ruleTag[1]);
      //if any eventId was retrieved
      if (eventId) {
        const event = await getCurrentStartedEvent(eventId);
        //if that event id has an associated ongoing event
        if (event) {
          //not positive this formatting gets the username
          let user = await getUser(tweet.data[0].author_id);
          if (!user) {
            user = await createUserDefault(
              tweet.users[0].id,
              tweet.users[0].username,
              tweet.users[0].name
            );
          } else if (
            user.name !== tweet.users[0].name ||
            user.username !== tweet.users[0].username
          ) {
            //update either name or username as necessary
            updateNames(
              user,
              user.name !== tweet.users[0].name
                ? tweet.users[0].name
                : user.name,
              user.username !== tweet.users[0].username
                ? tweet.users[0].username
                : user.username
            );
            user.name = tweet.users[0].name;
            user.username = tweet.users[0].username;
          }
          const userParticipatedEvents = user.participatedEvents.map(
            (event) => event.id
          );
          if (!userParticipatedEvents.includes(event.id)) {
            if (ruleTag[0] === 'ENCOUNTER')
              await handleEncounterTweet(tweet, user, event);
            else if (ruleTag[0] === 'MARKET')
              await handleMarketTweet(tweet, user, event);
            else if (ruleTag[0] === 'BOSS')
              await handleBossTweet(tweet, user, event);
          }
        }
      }
    }
  }
};

export const handleEncounterTweet = async (
  tweet: any,
  user: ExpandedUser,
  event: Event
) => {
  if (tweet.text.toLowerCase().includes('attack')) {
  } else if (tweet.text.toLowerCase().includes('forage')) {
    let cor = (await getParCor(FLOOR))?.value;
    if (cor) {
      cor *= Math.random() + 1; //Multiply foraging result by random value between (1,2)
    } else {
      console.log(
        `Something went wrong while calcing foraging cor for ${user.username}`
      );
    }
    let exp = (await getParExp(FLOOR))?.value;
    if (exp) {
      exp /= 5;
      exp *= Math.random() * 0.2 + 0.9; //rand (0.9,1.1)
    } else {
      console.log(
        `Something went wrong while calcing foraging exp for ${user.username}`
      );
    }
  }
};

export const handleMarketTweet = async (
  tweet: any,
  user: ExpandedUser,
  event: Event
) => {};

export const handleBossTweet = async (
  tweet: any,
  user: ExpandedUser,
  event: Event
) => {};

export const handleModerationTweet = async (tweet: any) => {};
