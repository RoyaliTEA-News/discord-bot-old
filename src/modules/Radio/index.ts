import { readdirSync } from "fs";

import client from "../../start/bot";

const collection = client.db.collection("radios");

export const updateRadios = () => {
  const list = readdirSync(`${process.cwd()}/radios/services/`, { withFileTypes: true });

  list.forEach(async x => {
    const file = require(`${process.cwd()}/radios/services/${x.name}`),
      radio = await file();

    await collection.findOneAndUpdate(
      { id: radio.id },
      { $set: { ...radio, lowerName: radio.name.toLowerCase() } },
      { upsert: true }
    );
  })
};