import { existsSync, readdirSync } from "fs";

const modules = readdirSync(`${process.cwd()}/dist/modules/`, {
	withFileTypes: true
})
	.filter(dirent => dirent.isDirectory())
	.map(x => `${process.cwd()}/dist/modules/${x.name}`);

export const loadCommands = async client => {
	client.info("Loading commands...");

	modules.forEach(async module => {
		const commandsPath = `${module}/commands/`;
		if (existsSync(commandsPath)) {
			readdirSync(commandsPath)
				.filter(x => x.endsWith(".js"))
				.forEach(file => {
					delete require.cache[require.resolve(`${commandsPath}${file}`)];

					const command = require(`${commandsPath}${file}`);
					command.category = module.split("/").reverse()[0].toLowerCase();
					command.directory = `${commandsPath}${file}`;
					command.aliases = command.aliases || [];
					client.commands.set(command.name, command);
					command.aliases.forEach(x => client.aliases.set(x, command));
				});
		}
	});

	process.stdout.moveCursor(0, -1);
	process.stdout.clearLine(1);
	client.success(`Loaded commands (${client.commands.size})`);
	return true;
};
