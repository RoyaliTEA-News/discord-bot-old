import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";

import { getStats, updateRadios } from "../";

export = {
  name: "play",
  aliases: [],
  description: "blrugy",
  async execute(data: InteractionResponse, client: Bot, args: string[]) {
    await updateRadios();

    const collection = client.db.collection("radios"),
      input = args?.[0].toLowerCase() || (data.options.get("radio")?.value as string)?.toLowerCase(),
      radio = await collection.findOne({ $or: [{ lowerName: input }, { lowerAliases: input }] });

    console.log(args, input)

    if (!radio) return data.reply({ content: `A radio with the name \`${input}\` was not found!`, ephemeral: true });
    
    const member = await data.guild.members.fetch(data.member.user.id);

    if(!member.voice?.channel) return data.reply({ content: "You must be in a voice channel to use this command!", ephemeral: true });

    data.reply(radio.sources[0].url)
  }
} as Command;