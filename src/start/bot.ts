import debug from "debug";

import { Client, Intents } from "../util/Client";

const client = new Client({
  startDebug: true,
  token: process.env.TOKEN,
  intents: Intents,
  fetchAllMembers: true,
  partials: []
} as BotOptions);

client.logger = debug("RoyaliTEA");

client.start();

export default client;