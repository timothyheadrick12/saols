import axios, { AxiosResponse } from "axios";
import addOAuthInterceptor from "axios-oauth-1.0a";
import { sleep } from "../sleep";

export const default_app_get = async (url: string) => {
  return base_app_get(url, {
    headers: {
      Authorization: `Bearer ${process.env.BEARER_TOKEN!}`,
    },
  });
};

export const stream_app_get = async (url: string) => {
  return base_app_get(url, {
    headers: {
      Authorization: `Bearer ${process.env.BEARER_TOKEN!}`,
    },
    responseType: "stream",
  });
};

export const base_app_get = async (
  url: string,
  config: any
): Promise<any | undefined> => {
  const TOO_MANY_REQUESTS = 429;
  // Create a client whose requests will be signed

  let response: any;
  let limitReached: boolean = false;
  let limitResetMs: number = 0;
  let noResponse: boolean = false;
  let attemptsLeft = 5;

  do {
    response = await axios
      .get(url, config)
      .then((response) => {
        return response.data.data;
      })
      .catch((err) => {
        console.log(
          "[app_get error at (" + new Date().toUTCString() + ")]\n" + err
        );
        if (err.response) {
          limitReached = err.response.status === TOO_MANY_REQUESTS;
          limitResetMs = parseInt(err.response.headers["x-rate-limit-reset"]);
          console.log(`Time to wait: ${limitResetMs}`);
        } else {
          noResponse = true;
        }
        return undefined;
      });
    if (limitReached) await sleep(limitResetMs!);
    if (noResponse) {
      await sleep(5000);
      attemptsLeft--;
    }
  } while (!response && attemptsLeft > 0);

  return response;
};

export const base_app_post = async (
  url: string,
  request: object
): Promise<any | undefined> => {
  const TOO_MANY_REQUESTS = 429;
  // Create a client whose requests will be signed

  let response: any;
  let limitReached: boolean = false;
  let limitResetMs: number = 0;
  let noResponse: boolean = false;
  let attemptsLeft = 5;

  do {
    response = await axios
      .post(url, request, {
        headers: {
          Authorization: `Bearer ${process.env.BEARER_TOKEN!}`,
        },
      })
      .then((response) => {
        return response.data.data;
      })
      .catch((err) => {
        console.log(
          "[app_post error at (" + new Date().toUTCString() + ")]\n" + err
        );
        if (err.response) {
          console.log(err.response);
          limitReached = err.response.status === TOO_MANY_REQUESTS;
          limitResetMs = parseInt(err.response.headers["x-rate-limit-reset"]);
          console.log(`Time to wait: ${limitResetMs}`);
        } else {
          noResponse = true;
        }
        return undefined;
      });
    if (limitReached) await sleep(limitResetMs!);
    if (noResponse) {
      await sleep(5000);
      attemptsLeft--;
    }
  } while (!response && attemptsLeft > 0);

  return response;
};

export const base_bot_post = async (
  url: string,
  request: object
): Promise<any | undefined> => {
  const TOO_MANY_REQUESTS = 429;
  // Create a client whose requests will be signed
  const client = axios.create();

  // Specify the OAuth options
  const options = {
    algorithm: "HMAC-SHA1" as const,
    key: process.env.API_KEY!,
    secret: process.env.API_KEY_SECRET!,
    token: process.env.OATH_TOKEN_KEY!,
    tokenSecret: process.env.OATH_TOKEN_SECRET!,
  };

  // Add interceptor that signs requests
  addOAuthInterceptor(client, options);

  let response: any;
  let limitReached: boolean = false;
  let limitResetMs: number = 0;
  let noResponse: boolean = false;
  let attemptsLeft = 5;

  do {
    response = await client
      .post(url, request)
      .then((response) => {
        return response.data.data;
      })
      .catch((err) => {
        console.log(
          "[bot_post error at (" + new Date().toUTCString() + ")]\n" + err
        );
        if (err.response) {
          limitReached = err.response.status === TOO_MANY_REQUESTS;
          limitResetMs = parseInt(err.response.headers["x-rate-limit-reset"]);
          console.log(`Time to wait: ${limitResetMs}`);
        } else {
          noResponse = true;
        }
      });
    if (limitReached) await sleep(limitResetMs!);
    if (noResponse) {
      await sleep(5000);
      attemptsLeft--;
    }
    console.log(response);
  } while (!response && attemptsLeft > 0);

  return response;
};
