import { Client as Cluster } from "discord-hybrid-sharding";
import { ClientOptions as DiscordClientOptions, CommandInteraction, Message } from "discord.js";

import { Api } from "@top-gg/sdk";

import Client from "../src/util/Client";

import type { Db } from "mongodb";
import type ModuleManager from "../src/util/Client/Managers/Modules";

declare global {
  interface Bot extends Client {
    modules: ModuleManager;
    shard: Cluster;
    db: Db;

    updateStatus?(): Promise<void>;
    executeCommand?(command: Command, data: InteractionResponse | Message, client: Bot, args?: string[], isButton?: boolean): void | Promise<void>;
    genString?(length: number): string;
    getStats?(): any;
  }

  interface ClientConfig {
    token: string;
    database: string;
    clientId: string;
  }

  interface Command {
    name: string;
    category?: string;
    directory?: string;
    description: string;
    permissions?: {
      role?: string;
      guild?: string;
      user?: string;
      permission?: PermissionResolvable;
    };
    execute(data: InteractionResponse, client: Bot, config): Promise<any> | any;
  }

  interface ClientEvent {
    name: string;
    type: string;
    execute(client: Bot, ...args: any): Promise<void> | void;
  }

  interface Array<T> {
    shuffle(): Array<T>;
  }

  export interface PosterOptions {
    interval?: number,
    postOnStart?: boolean
    startPosting?: boolean
    sdk?: Api
  }

  interface Msg extends Message { }
  interface ClientOptions extends DiscordClientOptions { }
  interface InteractionResponse extends CommandInteraction { }
}