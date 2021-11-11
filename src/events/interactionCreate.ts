import { CommandInteraction, Interaction } from "discord.js";

export = {
  name: "interactionCreate",
  type: "client",
  async run(client: Bot, response: Interaction) {
    if (response.isCommand()) {
      const interaction: CommandInteraction = response,
        command = client.commands.get(interaction.commandName);

      if (!command) return interaction.reply({ content: "That command has not yet been setup!", ephemeral: true });

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
};
