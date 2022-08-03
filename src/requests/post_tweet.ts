/**
 * File: post_tweet.ts
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

import axios from "axios";
import addOAuthInterceptor from "axios-oauth-1.0a";
import { sleep } from "../sleep";
export interface postTweetData {
  id?: string;
  limitReached?: boolean;
  limitResetMs?: number;
  noResponse?: boolean;
}

export default async (tweet: string): Promise<string | undefined> => {
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

  let response: postTweetData;
  let attemptsLeft = 5;

  do {
    response = await client
      .post("https://api.twitter.com/2/tweets", { text: tweet })
      .then((response) => {
        return { id: response.data.data.id };
      })
      .catch((err) => {
        console.log(
          "[Request Error At (" + new Date().toUTCString() + ")]\n" + err
        );
        if (err.response) {
          return {
            limitReached: err.response.status === TOO_MANY_REQUESTS,
            limitResetMs: parseInt(err.response.headers["x-rate-limit-reset"]),
          };
        } else {
          return { noResponse: true };
        }
      });
    if (response.limitReached) await sleep(response.limitResetMs!);
    if (response.noResponse) await sleep(5000);
    attemptsLeft--;
  } while (!response.id && attemptsLeft > 0);

  return response.id || undefined;
};
