import { CommandInteraction, Interaction } from "discord.js";

export = {
  name: "interactionCreate",
  type: "client",
  async execute(client, response: Interaction) {
    if (!client.readyAt) return client.logger.warn("Client not ready, not executing command.");

    if (response.isAutocomplete()) {
      if (!response.inGuild()) return response.respond([{
        name: "This command can only be used in a server.",
        value: "no_guild"
      }]);

      const autoCommand = require(`../../Auto/${response.commandName}.js`);
      autoCommand.execute(client, response);
    }

    if (response.isCommand()) {
      if (!response.inGuild()) return response.reply({ content: "This command can only be used in a server." });

      const interaction: CommandInteraction = response,
        command = client.commands.get(interaction.commandName);

      if (!command) return interaction.reply({ content: "That command has not yet been setup, or is not yet on this shard!", ephemeral: true });

      if (command.permissions) {
        if (command.permissions.user && response.user.id !== command.permissions.user) return noPermission(interaction);
        if (command.permissions.guild && response.guildId !== command.permissions.guild) return noPermission(interaction);

        if (response.inGuild()) {
          const member = await (await client.guilds.fetch(response.guildId)).members.fetch(response.user.id);
          if (command.permissions.permission && !member.permissions.has(command.permissions.permission)) return noPermission(interaction);
          if (command.permissions.role && !member.roles.cache.find(x => x.id === command.permissions.role)) return noPermission(interaction);
        }
      }

      client.executeCommand(command, interaction, client);
    }

    function noPermission(int: CommandInteraction): void {
      int.reply({
        embeds: [{
          title: "An error has occured!",
          color: 0xc21515,
          description: "You are not authorized to use this command."
        }], ephemeral: true
      });
    }
  }
} as ClientEvent;
