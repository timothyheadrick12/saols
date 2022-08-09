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
