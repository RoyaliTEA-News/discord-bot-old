import { MessageEmbed } from "discord.js";

export = {
  name: "error",
  aliases: [],
  description: "a",
  permissions: {
    user: ["506899274748133376", "695608126602477629"]
  },
  hidden: true,
  async execute(data: Msg, client: Bot, args: string[]) {
    if(!args[0]) return data.reply("Please provide an error ID!");

    const error = await client.db.collection("errors").findOne({ errorId: args[0] });
    if(!error) return data.reply("Invalid error ID!");

    const embed = new MessageEmbed()
      .setTitle(args[0])
      .setColor("RED")
      .setDescription(`${error.error.short}`)
      .setFooter(`${error.command} - ${error.user?.tag || "Unknown User"}`);

    data.reply({ embeds: [embed] });
  }
} as Command;