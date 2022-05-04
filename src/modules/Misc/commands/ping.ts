import { MessageEmbed } from "discord.js";

export = {
  name: "ping",
  description: "Check the API Latency!",
  async execute(data, client) {
    const msg = await data.reply({ embeds: [{ description: "Fetching ping..." }], ephemeral: true, fetchReply: true }) as Msg,
      embed = new MessageEmbed()
        .addFields([
          {
            name: ":signal_strength: Bot Ping",
            value: `${msg.createdTimestamp - data.createdTimestamp}ms`,
            inline: true
          },
          {
            name: ":computer: API Latency",
            value: `${client.ws.ping}ms`,
            inline: true
          }
        ]);

    data.editReply({ embeds: [embed] });
  }
} as Command;
