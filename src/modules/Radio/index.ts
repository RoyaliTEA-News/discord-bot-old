import axios from "axios";
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

export const getStats = async (radio) => {
  const { data: stats } = await axios(radio.api.endpoint);

  if (radio.api.type === "azuracast") return {
    presenter: stats.live.is_live ? stats.live.streamer_name : "AutoDJ",
    listeners: stats.listeners.total,
    song: {
      name: stats.now_playing.song.title,
      artist: stats.now_playing.song.artist,
      cover: stats.now_pplaying.song.art
    }
  }

  if (radio.api.type === "custom") {
    const api = radio.api;

    console.log(api)

    return {
      presenter: stats[api.presenter],
      listeners: stats[api.listeners],
      song: stats[api.song]
    }
  }
}