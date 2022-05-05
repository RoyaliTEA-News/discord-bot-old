import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";

import { getStats, updateRadios } from "../";

export = {
  name: "stats",
  aliases: [],
  description: "blrugy",
  async execute(data: InteractionResponse, client: Bot, args: string[]) {
    await updateRadios();

    const collection = client.db.collection("radios"),
      input = args?.[0].toLowerCase() || (data.options.get("radio")?.value as string)?.toLowerCase(),
      radio = await collection.findOne({ $or: [{ lowerName: input }, { lowerAliases: input }] });

    if (!radio) return data.reply({ content: `A radio with the name \`${input}\` was not found!`, ephemeral: true });

    const stats = await getStats(radio),
      row = new MessageActionRow();

    row.addComponents([
      new MessageButton()
        .setLabel("Website")
        .setStyle("LINK")
        .setURL(radio.website || "https://google.com")
        .setDisabled(radio.website ? false : true),
      new MessageButton()
        .setLabel("Discord")
        .setStyle("LINK")
        .setURL(radio.discord || "https://google.com")
        .setDisabled(radio.discord ? false : true)
    ]);

    const embed = new MessageEmbed()
      .setAuthor(`🎵 ${radio.name}`, radio.logo)
      .setColor(radio.color ?? "#2f3136")
      .setThumbnail(stats.song.art)
      .setDescription(`**${stats.presenter}** is currently streaming to **${stats.listeners} listeners**.`)
      .addField("Currently Playing", `**${stats.song.title}** by **${stats.song.artist}**`)

    data.reply({ embeds: [embed], components: [row] });
  }
} as Command;