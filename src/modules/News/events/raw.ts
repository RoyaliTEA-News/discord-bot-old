import { TextChannel } from "discord.js";

export = {
  name: "raw",
  type: "client",
  async run(client: Bot, data) {
    if (data.t !== "MESSAGE_REACTION_ADD" || data.d.user_id === client.user.id || data.d.emoji.name !== "📰") return;

    const channel = await client.channels.fetch(data.d.channel_id) as TextChannel,
      message = await channel.messages.fetch(data.d.message_id);

    if(!message.hasThread) {
      message.reactions.resolve("📰")?.remove();
      message.startThread({ name: "Article Thread" });
    }
  }
}
