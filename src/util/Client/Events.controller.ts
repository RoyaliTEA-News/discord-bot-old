import { existsSync, readdirSync } from "fs";

const modules = readdirSync(`${process.cwd()}/dist/modules/`, {
	withFileTypes: true
})
	.filter(dirent => dirent.isDirectory())
	.map(x => `${process.cwd()}/dist/modules/${x.name}`);

export const loadEvents = async (client: Bot) => {
	client.moduleCount = modules.length;
	client.info("Loading events...");

	modules.forEach(module => {
		const eventsPath = `${module}/events/`;
		if (existsSync(eventsPath)) {
			readdirSync(eventsPath)
				.filter(x => x.endsWith(".js"))
				.forEach(file => {
					delete require.cache[require.resolve(`${eventsPath}${file}`)];

					const event = require(`${eventsPath}${file}`);
					client.events.set(event.name + Math.random(), event);
					client.on(event.name, (...args) => event.run(client, ...args));
				});
		}
	});

	readdirSync(`${process.cwd()}/dist/events/`)
		.filter(x => x.endsWith(".js"))
		.forEach(async file => {
			delete require.cache[require.resolve(`${process.cwd()}/dist/events/${file}`)];

			const event = require(`${process.cwd()}/dist/events/${file}`);
			client.events.set(event.name + Math.random(), event);
			event.type && event.type !== "process"
				? client.on(event.name, (...args) => event.run(client, ...args))
				: process.on(event.name, (...args) => event.run(client, ...args));
		});

	process.stdout.moveCursor(0, -1);
	process.stdout.clearLine(1);
	client.success(`Loaded events (${client.events.size})`);

	return true;
};