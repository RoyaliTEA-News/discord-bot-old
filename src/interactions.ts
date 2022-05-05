import axios from "axios";
import { writeFile } from "fs/promises";

import { SlashCommandBuilder } from "@discordjs/builders";

import { clientId, token } from "./config";
import { error, info } from "./util/logger";

export const updateInteractions = async () => {
  try {
    const interactions = [...commands, ...context],
      { data: cmds }: any = await axios(`https://discord.com/api/v9/applications/${clientId}/commands`, {
        headers: {
          authorization: `Bot ${token}`
        }
      }),
      headers = {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bot ${token}`
        }
      };

    writeFile(`${process.cwd()}/interactions.json`, JSON.stringify(interactions, undefined, 2));

    cmds.forEach(async cmd => {
      if (!interactions.map(x => x.name).includes(cmd.name))
        await axios.delete(`https://discord.com/api/v9/applications/${clientId}/commands/${cmd.id}`, headers).catch(e => error(e.code, e.response.data.errors));
    });

    interactions.forEach(async cmd => {
      if (!cmds.map(x => x.name).includes(cmd.name))
        await axios.post(`https://discord.com/api/v9/applications/${clientId}/commands`, JSON.stringify(cmd), headers).catch(e => error(e.code, e.response.data.errors));
    });

    info("Interactions updated.");
  } catch {
    error("Failed to update interactions.");
  }

  return true;
};

export const commands = [
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Check the ping."),
  new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Invite our bot to your discord server."),
  new SlashCommandBuilder()
    .setName("website")
    .setDescription("Get a link to our website."),
  new SlashCommandBuilder()
    .setName("play")
    .setDescription("Stream a radio station in a voice or stage channel!")
    .addStringOption(x => x
      .setName("radio")
      .setDescription("Which radio are you trying to play?")
      .setRequired(true)
      .setAutocomplete(true)
    )
    .addStringOption(x => x
      .setName("mount")
      .setDescription("Select a mount point! If none is provided, the default mountpoint will be chosen.")
      .setRequired(false)
    ),
  new SlashCommandBuilder()
    .setName("stats")
    .setDescription("View statistics for a specific radio!")
    .addStringOption(x => x
      .setName("radio")
      .setDescription("Which radio are you trying to view?")
      .setRequired(true)
      .setAutocomplete(true)
    )
];

export const context = [

];
