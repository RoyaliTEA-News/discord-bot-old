import { exec } from "child_process";
import { Collection } from "discord.js";

export = {
  name: "reload",
  description: "a",
  aliases: [],
  permissions: {
    user: "506899274748133376"
  },
  hidden: true,
  async execute(data: Msg, client: Bot) {
    const msg = await data.reply("Reloading..");
    exec("yarn compileLive", { cwd: process.cwd() }, async () => {
      delete require.cache[require.resolve(`${process.cwd()}${"/dist/util/methods.js"}`)];
      delete require.cache[require.resolve(`${process.cwd()}${"/dist/config.js"}`)];

      const methods = require("../../../util/methods"),
        config = await import("../../../config");

      msg.edit("Reloading methods and config...");

      client.config = config;
      Object.keys(methods).forEach(key => (client[key] = methods[key]));

      await sleep(1000);

      client.commands = new Collection();
      client.events = new Collection();

      client.removeAllListeners();

      msg.edit("Reloading commands and events...");

      await client.handlers.loadCommands(client);
      await client.handlers.loadEvents(client);

      await sleep(1000);

      msg.edit("Done!");
    });
  }
} as Command;

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}