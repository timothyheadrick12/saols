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
import {
  base_app_post,
  default_app_get,
  stream_app_get,
} from "./base_requests";

export const add_rule = async (
  filter: string,
  tag: string
): Promise<boolean> => {
  const response = await base_app_post(
    "https://api.twitter.com/2/tweets/search/stream/rules",
    {
      add: [{ value: filter, tag: tag }],
    }
  );

  return response[0].id || undefined;
};

export const get_rule_ids = async () => {
  const response = await default_app_get(
    "https://api.twitter.com/2/tweets/search/stream/rules"
  );

  if (response === undefined) {
    console.log(
      "[Failed to get filter ids at (" + new Date().toUTCString() + ")]"
    );
    return undefined;
  } else if (response.length === 0) {
    console.log(
      "[Success, but got no filter ids at (" + new Date().toUTCString() + ")]"
    );
    return [];
  }
  const responseIds = response.map((dataObject: any) => dataObject.id);

  return responseIds;
};

//accepts a variable number of rule ids to remove
export const remove_rules = async (...ids: string[]) => {
  const response = await base_app_post(
    "https://api.twitter.com/2/tweets/search/stream/rules",
    {
      delete: { ids: [ids] },
    }
  );

  return response !== undefined;
};

export const stream_connect = async () => {
  const respoonse = await stream_app_get(
    "https://api.twitter.com/2/tweets/search/stream"
  );

  //   const stream = response;

  //   stream.on("data", (data) => {
  //     console.log(data);
  //   });

  //   stream.on("end", () => {
  //     console.log("stream done");
  //   });
};
