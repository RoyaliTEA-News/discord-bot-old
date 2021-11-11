export = {
  name: "restart",
  aliases: [],
  description: "a",
  permissions: {
    user: ["506899274748133376", "695608126602477629"]
  },
  hidden: true,
  async execute(data: Msg) {
    await data.delete();
    process.exit(1);
  }
} as Command;