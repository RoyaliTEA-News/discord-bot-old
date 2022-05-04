import { Permissions } from "discord.js";

export = {
  name: "invite",
  description: "Add our bot to your discord server!",
  async execute(data, client) {
    const invite = client.generateInvite({
      scopes: ["bot", "applications.commands"],
      permissions: Permissions.ALL
    });

    data.reply({ content: `Add ${client.user.username} to your server with the following link!\n${invite}` });
  }
} as Command;
