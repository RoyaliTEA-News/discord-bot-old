import {
  createAudioPlayer, createAudioResource, entersState, StreamType, VoiceConnection,
  VoiceConnectionStatus
} from "@discordjs/voice";

export const playStream = async (url, channel: VoiceConnection): Promise<boolean> => {
  try {
    const player = createAudioPlayer(),
      resource = createAudioResource(url, { inputType: StreamType.Raw, inlineVolume: true }),
      connection = await entersState(channel, VoiceConnectionStatus.Ready, 30e3);

    player.play(resource);
    connection.subscribe(player);

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};
