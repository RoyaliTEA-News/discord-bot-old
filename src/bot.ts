import { token } from "./config";
import Client from "./util/Client";

const Bot = new Client({
  intents: [
    "GUILD_VOICE_STATES",
    "GUILDS"
  ],
  allowedMentions: {
    parse: []
  },
  waitGuildTimeout: 3000
});

Bot.start(token);

export default Bot;
