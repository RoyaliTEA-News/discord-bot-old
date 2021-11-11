export = {
  name: "restart",
  aliases: [],
  description: "a",
  permissions: {
    user: "506899274748133376"
  },
  hidden: true,
  async execute(data: Msg) {
    await data.delete();
    process.exit(1);
  }
} as Command;