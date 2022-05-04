import { Client as Base, Collection } from "discord.js";
import { existsSync } from "fs";
import { Db } from "mongodb";

import { debug, error, info, shard, warn } from "../logger";
import DatabaseManager from "./Managers/Database";
import ModuleManager from "./Managers/Modules";
import * as Methods from "./methods";

class Client extends Base {
  declare readonly options;

  readonly logger = { error, warn, info, debug, shard };
  readonly config: ClientConfig = require("../../config");

  db: Db;

  database = new DatabaseManager();
  modules = new ModuleManager(this);
  events = new Collection<string, Event>();
  aliases = new Collection<string, Command>();
  commands = new Collection<string, Command>();

  constructor(options: ClientOptions) {
    super(options);
    this.options = {
      ...this.options,
      ...options
    };
  }

  async start(token: string): Promise<void> {
    if (!token) {
      error("No token provided, exiting.");
      process.exit(1);
    }

    if (existsSync(`${process.cwd()}/dist/modules`)) this.modules.loadModules();

    Object.keys(Methods).forEach(key => (this[key] = Methods[key]));

    this.db = await this.database.connect();

    this.events = this.modules.events;
    this.aliases = this.modules.aliases;
    this.commands = this.modules.commands;

    this.login(token)
      .then(() => { })
      .catch(x => error(`Failed to login: ${x}`));
  }
}

export default Client;
