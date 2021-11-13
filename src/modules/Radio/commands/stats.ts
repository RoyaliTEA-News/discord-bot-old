import { MessageEmbed } from "discord.js";

import { getStats, updateRadios } from "../";

export = {
  name: "stats",
  aliases: [],
  description: "blrugy",
  async execute(data: InteractionResponse, client: Bot, args: string[]) {
    await updateRadios();

    const collection = client.db.collection("radios"),
      input = args?.[0].toLowerCase() || (data.options.get("radio")?.value as string)?.toLowerCase(),
      radio = await collection.findOne({ lowerName: input });

    console.log(input)

    if (!radio) return data.reply({ content: `A radio with the name \`${input}\` was not found!`, ephemeral: true });

    const stats = await getStats(radio),
      embed = new MessageEmbed()
        .setTitle(`🎵 ${radio.name}`)
        .setColor("#2f3136")
        .setThumbnail(stats.song.art)
        .setDescription(`**${stats.presenter}** is currently streaming to **${stats.listeners} listeners**.`)
        .addField("Currently Playing", `**${stats.song.title}** by **${stats.song.artist}**`)

    data.reply({ embeds: [embed] });
  }
} as Command;