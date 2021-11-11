import type {
    ClientOptions, Collection, CommandInteraction, Message, PermissionResolvable, ShardClientUtil
} from "discord.js";
import type { Db } from "mongodb";
import type Statcord from "statcord.js";

import type { Client } from "../src/util/Client";
declare global {
  interface Shard extends ShardClientUtil {
    id: number;
  }

  interface Bot extends Client {
    db: Db;
    shard: Shard;
    events: Collection<string, ClientEvent>;
    aliases: Collection<string, Command>;
    commands: Collection<string, Command>;
    config: clientConfig;
    handlers;
    moduleCount?: number;
    statcord?: Statcord.Client;
    initDatabase(): Promise<Db>;
    info(message: string | number): void;
    debug(message: string | number): void;
    error(message: string | number): void;
    dbLog(message: string | number): void;
    success(message: string | number): void;

    updateStatus?(): Promise<void>;
    fetchUses?(bot: Bot, cmd: Command): Promise<string>;
    executeCommand?(command: Command, data: InteractionResponse | Message, client: Bot, args?: string[]): void | Promise<void>;
    genString?(length: number): string;
    getMember?(data: InteractionResponse, args: string[]): Promise<GuildMember>;
    getGuildConfig?(guildId: string): Promise<GuildConfig>;
  }

  interface BotOptions extends ClientOptions {
    startDebug?: boolean;
    token?: string;
    noLog?: boolean;
  }

  interface clientConfig {
    prefix: string;
    database: string;
    clientId: string;
  }

  interface category {
    name: string;
    nameFormatted: string;
    emoji: string;
  }

  interface Command {
    name: string;
    aliases: string[];
    category?: string;
    directory?: string;
    description: string;
    hidden?: boolean;
    permissions?: {
      role?: string;
      guild?: string;
      user?: string;
      permission?: PermissionResolvable;
    };
    execute(data: InteractionResponse | Message, client: Bot, args?: string[]): Promise<any> | any;
  }

  interface ClientEvent {
    name: string;
    type: string;
    run(...args: any): void;
  }


  interface Msg extends Message { }
  interface InteractionResponse extends CommandInteraction { }

}