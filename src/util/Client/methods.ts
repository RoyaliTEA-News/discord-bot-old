import client from "../../bot";

let statusCache, stats = {} as any;

export const updateStatus = async (): Promise<void> => {
  const list = [{
    type: "LISTENING",
    name: `${stats.presenter.name}`
  }, {
    type: "LISTENING",
    name: `${stats.song.title} by ${stats.song.artist}`
  }].filter(x => x !== statusCache),
    activity = list[Math.floor(Math.random() * list.length)];

  statusCache = activity;

  client.user.setActivity(activity.name, { type: activity.type as any });
};

export const genString = (length) => {
  let result = "";

  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++)
    result += characters.charAt(Math.floor(Math.random() * characters.length));

  return result;
};

export const executeCommand = async (cmd: Command, data: InteractionResponse, client: Bot): Promise<void> => {
  try {
    await cmd.execute(data, client, {});

    client.logger.info(`Executing command ${cmd.name}, ran by ${data.user.tag} in ${data.guild.name}.`);

    client.db.collection("commandUses").updateOne(
      { name: cmd.name },
      { $inc: { count: 1 } },
      { upsert: true }
    );

    client.db.collection("clusters").updateMany(
      {
        processTime: Number(process.argv.filter(x => x.includes("processTime"))?.[0].split("=")[1]),
        clusterId: client.shard.id
      },
      {
        $inc: { commandsSincePost: 1 },
        $push: { usersOneCommand: data.user.id } as any
      }
    );
  } catch (error) {
    const errorId = client.genString(10);

    data[data.replied ? "editReply" : "reply"]({
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
        tag: data.user.tag,
        id: data.user.id
      }
    });
  }
};
