import Statcord from "statcord.js";

import { updateRadios } from "../modules/Radio";

export = {
	name: "ready",
	type: "client",
	async run(client: Bot) {
		client.success(`Connected. (${client.guilds.cache.size} Guilds)`);
		client.updateStatus();
		setInterval(client.updateStatus, 15000);

		updateRadios();

		client.statcord = new Statcord.Client({
			key: process.env.STATCORD,
			client,
			postCpuStatistics: true,
			postMemStatistics: true,
			postNetworkStatistics: false
		});

		client.statcord.post();
		client.statcord.autopost();
	}
};
