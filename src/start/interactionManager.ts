import axios from "axios";
import { writeFile } from "fs/promises";

import { clientId } from "../config";
import { commands, context } from "../interactions";

export const load = async () => {
  const interactions = [...commands, ...context],
    { data: cmds }: any = await axios(`https://discord.com/api/v9/applications/${clientId}/commands`, {
      headers: {
        authorization: `Bot ${process.env.TOKEN}`
      }
    });

  writeFile(`${process.cwd()}/interactions.json`, JSON.stringify(interactions, undefined, 2));

  cmds.forEach(async cmd => {
    if (!interactions.map(x => x.name).includes(cmd.name)) await axios.delete(`https://discord.com/api/v9/applications/${clientId}/commands/${cmd.id}`, {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bot ${process.env.TOKEN}`
      }
    }).catch(e => console.log(e.response.data.errors));
  });

  interactions.forEach(async cmd => {
    if (!cmds.map((x: Command) => x.name).includes(cmd.name)) await axios.post(`https://discord.com/api/v9/applications/${clientId}/commands`, JSON.stringify(cmd), {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bot ${process.env.TOKEN}`
      }
    }).catch(e => console.log(e.response.data.errors));
  });
};

export default load;