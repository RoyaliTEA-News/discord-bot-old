import { AutocompleteInteraction } from "discord.js";

export = {
  async execute(client, data: AutocompleteInteraction) {
    data.respond(
      client.radios.map(x => {
        return {
          name: x.name,
          value: x.name
        };
      }).filter(x => x.name.toLowerCase().includes((data.options.get("radio").value as string).toLowerCase()))
    );
  }
};