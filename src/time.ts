const DAILY_RESET_TIME = 2; //2 am

export const msUntilTime = (date: Date): number => {
  var now = new Date() as any;
  var millisTillTime = (date as any) - now;
  return millisTillTime;
};

export const msUntilReset = (): number => {
  const now = new Date() as any;
  const reset = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    DAILY_RESET_TIME,
    0,
    0
  ) as any;
  let msUntilReset = reset - now;
  msUntilReset = msUntilReset < 0 ? msUntilReset + 86400000 : msUntilReset;
  return msUntilReset;
};
