import { ContextMenuCommandBuilder, SlashCommandBuilder } from "@discordjs/builders";

export const commands = [
  new SlashCommandBuilder()
    .setName("stats")
    .setDescription("View statistics for a radio station!")
    .addStringOption(x => x
      .setName("radio")
      .setDescription("Which radio are you trying to view?")
      .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("play")
    .setDescription("Stream a radio station in a voice or stage channel!")
    .addStringOption(x => x
      .setName("radio")
      .setDescription("Which radio are you trying to play?")
      .setRequired(true)
    )
    .addStringOption(x => x
      .setName("mount")
      .setDescription("Select a mount point! If none is provided, the default mountpoint will be chosen.")
      .setRequired(false)
    )
];

export const context = [

];
