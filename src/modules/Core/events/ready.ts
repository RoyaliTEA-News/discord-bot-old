import { MessageActionRow, MessageButton, MessageEmbed, TextChannel } from "discord.js";

export = {
  name: "ready",
  execute(client) {
    client.logger.info(`Logged in as ${client.user.tag}!`);

    function sendVerifyEmbed(self, reSend) {
      const channel: TextChannel = client.channels.cache.get(client.config.channels.verify);

      if (channel)
        channel.messages.fetch({ limit: 100 }).then(async messages => {
          messages.forEach(message => {
            if (!message.embeds[0]) message.delete();
          });

          if (!reSend) return;

          const embed = new MessageEmbed()
            .setColor("#00ff00")
            .setTitle("Verification")
            .setDescription("Please verify by clicking the button below, upon completion you will have access to the server.")
            .setFooter("RoyaliTEA", client.user.displayAvatarURL());

          const row = new MessageActionRow()
            .addComponents(
              new MessageButton()
                .setLabel("Verify")
                .setStyle("PRIMARY")
                .setCustomId("mainMsg")
            )

          await channel.send({ embeds: [embed], components: [row] });
        });
    }

    sendVerifyEmbed(sendVerifyEmbed, false);
  }
}