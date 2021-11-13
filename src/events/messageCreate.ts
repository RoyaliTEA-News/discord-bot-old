import { Message } from "discord.js";

export = {
	name: "messageCreate",
	type: "client",
	async run(client: Bot, message: Message) {
		if (!message.content.startsWith(client.config.prefix) || message.author.bot) return;

		const messageArray = message.content.split(" "),
			cmd = messageArray[0],
			args = messageArray.slice(1),
			sliced = cmd.slice(client.config.prefix.length).toLowerCase(),
			command = client.commands.get(sliced) || client.aliases.get(sliced);

		if (!command) return;

		if (command.permissions) {
			if (command.permissions.user && !command.permissions.user.includes(message.author.id)) return noPermission();
			if (command.permissions.guild && message.guildId !== command.permissions.guild) return noPermission();
			if (command.permissions.permission && !message.member.permissions.has(command.permissions.permission)) return noPermission();
			if (command.permissions.role && !message.member.roles.cache.find(x => x.id === command.permissions.role)) return noPermission();
		}

		client.executeCommand(command, message, client, args);

		function noPermission(): void {
			message.reply({
				embeds: [{
					title: "An error has occured!",
					color: 0xc21515,
					description: "You are not authorized to use this command."
				}]
			});
		}
	}
}
