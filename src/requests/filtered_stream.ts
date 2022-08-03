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

export interface postStreamFilterResponse {
  success?: boolean;
  limitReached?: boolean;
  limitResetMs?: number;
  noResponse?: boolean;
}

export const add_rule = async (
  filter: string,
  tag: string
): Promise<boolean> => {
  const TOO_MANY_REQUESTS = 429;
  // Create a client whose requests will be signed

  let response: postStreamFilterResponse;
  let attemptsLeft = 5;

  do {
    response = await axios
      .post(
        "https://api.twitter.com/2/tweets/search/stream/rules",
        {
          add: [{ value: filter, tag: tag }],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.BEARER_TOKEN!}`,
          },
        }
      )
      .then((response) => {
        return { success: true };
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
  } while (!response.success && attemptsLeft > 0);

  return response.success || false;
};

export interface GetStreamFiltersResponse {
  ids?: any[];
  limitReached?: boolean;
  limitResetMs?: number;
  noResponse?: boolean;
}

const remove_rules = async () => {
  const TOO_MANY_REQUESTS = 429;
  // Create a client whose requests will be signed

  let response: GetStreamFiltersResponse;
  let attemptsLeft = 5;

  do {
    response = await axios
      .get("https://api.twitter.com/2/tweets/search/stream/rules", {
        headers: {
          Authorization: `Bearer ${process.env.BEARER_TOKEN!}`,
        },
      })
      .then((response) => {
        return { ids: response.data.data };
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
  } while (!response.ids && attemptsLeft > 0);

  if (!response.ids) {
    console.log(
      "[Failed to get filter ids at (" + new Date().toUTCString() + ")]"
    );
    return;
  }
};
