import Statcord from "statcord.js";

export = {
	name: "ready",
	type: "client",
	async run(client: Bot) {
		client.success(`Connected. (${client.guilds.cache.size} Guilds)`);
		client.updateStatus();
		setInterval(client.updateStatus, 15000);

		client.statcord = new Statcord.Client({
			key: process.env.STATCORD,
			client,
			postCpuStatistics: false,
			postMemStatistics: false,
			postNetworkStatistics: false
		});

		client.statcord.post();
		client.statcord.autopost();
	}
};
