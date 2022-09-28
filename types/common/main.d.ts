import {BaseWeapon, Item, TweetType, User, Weapon} from '@prisma/client';

declare global {
  interface IMinEvent {
    tweetText: string;
    startDateTime: Date;
    endDateTime: Date;
    type: TweetType;
  }

  interface streamRule {
    tag?: string;
    value: string;
  }

  interface ExpandedUser extends User {
    weapon: Weapon & {
      BaseWeapon: BaseWeapon;
    };
    items: Item[];
    participatedEvents: {
      id: number;
    }[];
    weaponInventory: Weapon[];
  }
}
