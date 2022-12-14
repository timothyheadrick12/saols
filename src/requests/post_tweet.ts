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
import { base_bot_post } from "./base_requests";
export interface postTweetData {
  id?: string;
  limitReached?: boolean;
  limitResetMs?: number;
  noResponse?: boolean;
}

export default async (tweet: string): Promise<string | undefined> => {
  const response = await base_bot_post("https://api.twitter.com/2/tweets", {
    text: tweet,
  });
  return response.id || undefined;
};
