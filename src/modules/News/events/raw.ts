import { MessageEmbed, TextChannel } from "discord.js";

export = {
  name: "raw",
  type: "client",
  async run(client: Bot, data) {
    if (data.t !== "MESSAGE_REACTION_ADD" || data.d.user_id === client.user.id || data.d.emoji.name !== "📰") return;

    const channel = await client.channels.fetch(data.d.channel_id) as TextChannel,
      message = await channel.messages.fetch(data.d.message_id);

    if (channel.isThread() || !client.config.newsChannels.includes(message.channel.id)) return;
    if (message.author.system) return message.delete();

    if (!message.hasThread) {
      message.reactions.resolve("📰")?.remove();

      const collection = client.db.collection("threads"),
        count = (await collection.count()) + 1;

      await collection.insertOne({
        articleId: count,
        messageId: data.d.message_id,
        authorId: data.d.member_id,
        channelId: data.d.channel_id
      });

      const thread = await message.startThread({ name: `Thread ${count}` }),
        member = await client.users.fetch(data.d.member.user.id),
        embed = new MessageEmbed()
          .setColor("#2f3136")
          .setAuthor(`Started by ${member.tag}`, member.displayAvatarURL(), `https://royalitea.news/articles/${channel.id}/${message.id}`)
          .setDescription(`[Click here](https://royalitea.news/articles/${channel.id}/${message.id}) to view this thread on our website!`)
          .setTimestamp()
          .setFooter(`Thread ${count}`, client.user.displayAvatarURL())

      thread.send({ embeds: [embed] });
    }
  }
}
