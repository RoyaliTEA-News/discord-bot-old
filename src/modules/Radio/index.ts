import axios from "axios";
import { readdirSync } from "fs";
import scan from "object-search";

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
      title: stats.now_playing.song.title,
      artist: stats.now_playing.song.artist,
      art: stats.now_playing.song.art
    }
  }

  if (radio.api.type === "custom") {
    const api = radio.api;

    return {
      presenter: scan.get(stats, api.presenter),
      listeners: scan.get(stats, api.listeners),
      song: {
        title: scan.get(stats, api.song),
        artist: scan.get(stats, api.artist),
        art: scan.get(stats, api.art)
      }
    }
  }
}