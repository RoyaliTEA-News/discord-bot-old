import { updateRadios } from "../";

export = {
  name: "stats",
  aliases: [],
  description: "blrugy",
  async execute(data: InteractionResponse, client: Bot, args: string[]) {
    await updateRadios();

    const collection = client.db.collection("radios"),
      input = args?.[0].toLowerCase() || (data.options.get("radio")?.value as string)?.toLowerCase(),
      radio = await collection.findOne({ lowerName: input });

    console.log(input)

    if(!radio) return data.reply({ content: `A radio with the name \`${input}\` was not found!`, ephemeral: true });

    console.log(radio)

    data.reply({ content: "radio found", ephemeral: true });
  }
} as Command;