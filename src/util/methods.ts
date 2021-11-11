import { GuildMember, Message } from "discord.js";

import client from "../start/bot";

let statusCache;

export const updateStatus = async () => {

  const list = [
    `${client.guilds.cache.size} guilds!`,
    `${client.commands.size} commands!`
  ].filter(x => x !== statusCache),
    activity = list[Math.floor(Math.random() * list.length)];

  statusCache = activity;

  client.user.setActivity(activity, { type: "WATCHING" });
};

export const genString = (length) => {
  let result = "";

  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
};

export const executeCommand = async (cmd: Command, data: InteractionResponse | Message, client: Bot, args?: string[]) => {
  const uses = client.db.collection("commandUses");

  await uses.updateOne(
    { name: cmd.name },
    { $inc: { count: 1 } },
    { upsert: true }
  );

  try {
    if(data.guild?.id) client.statcord.postCommand(cmd.name, data.member?.user.id);
    return await cmd.execute(data, client, args || undefined);
  } catch (error) {
    const errorId = client.genString(10);

    data[(data as InteractionResponse).replied ? "editReply" : "reply"]({
      embeds: [{
        title: "An error has occured!",
        color: 0xc21515,
        description: `An error occured while executing that command, please report this to our team!\n**ID:** ${errorId}`
      }], ephemeral: true
    });

    client.db.collection("errors").insertOne({
      errorId,
      command: cmd.name,
      error: {
        short: error.toString(),
        stack: error.stack.toString()
      },
      user: {
        tag: (data as InteractionResponse).user?.tag || (data as Message).author?.tag || "Unknown",
        id: (data as InteractionResponse).user?.id || (data as Message).author?.id || "Unknown"
      }
    });
  }
};

export const getMember = async (data: InteractionResponse, args: string[]): Promise<GuildMember | boolean> => {
  let user: GuildMember | boolean;

  try {
    if (args) {
      const msg: Msg = data as unknown as Msg;
      if (!msg.mentions.members.first()) {
        if (!args[0]) user = await data.guild.members.fetch(data.member.user.id);
        else user = await msg.guild.members.fetch(args[0]) || false;
      } else user = msg.mentions.members.first();
    } else user = await data.guild.members.fetch(data.options.get("user")?.value as string ?? data.member.user.id);
  } catch {
    user = false;
  }

  return user;
};
