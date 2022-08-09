import Client from "twitter-api-sdk";

export const client = new Client(process.env.BEARER_TOKEN!);
