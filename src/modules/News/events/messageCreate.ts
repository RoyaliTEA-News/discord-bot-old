import { Message } from "discord.js";

export = {
	name: "messageCreate",
	type: "client",
	async run(client: Bot, message: Message) {
		if (!client.config.newsChannels.includes(message.channel.id) || message.content.length <= 0) return;

		message.react("📰")
		setTimeout(() => { message.reactions.resolve("📰")?.remove(); }, 10000);
	}
}
