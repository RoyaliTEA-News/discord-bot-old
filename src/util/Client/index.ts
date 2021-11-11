import * as Discord from "discord.js";
import { Db, MongoClient } from "mongodb";

import * as Methods from "../methods";
import { loadCommands } from "./Commands.controller";
import { loadEvents } from "./Events.controller";

export class Client extends Discord.Client implements Bot {
  logger;
  info;
  debug;
  error;
  dbLog;
  success;

  //@ts-ignore
  readonly options: BotOptions;
  readonly config: clientConfig = require("../../config");

  db: Db;
  shard: Shard = this.shard;
  handlers;

  events = new Discord.Collection<string, any>();
  aliases = new Discord.Collection<string, any>();
  commands = new Discord.Collection<string, any>();

  constructor(options: BotOptions) {
    super(options);
    this.options = {
      ...this.options,
      ...options
    };
  }

  async loadLogger(): Promise<boolean> {
    const database = this.logger.extend("database"),
      success = this.logger.extend("success"),
      debug = this.logger.extend("debug"),
      error = this.logger.extend("error"),
      info = this.logger.extend("info");

    database.color = "4";
    success.color = "4";
    debug.color = "4";
    error.color = "4";
    info.color = "4";

    this.success = success;
    this.dbLog = database;
    this.debug = debug;
    this.error = error;
    this.info = info;

    return true;
  }

  async initDatabase(): Promise<Db> {
    this.dbLog("Connecting...");
    const db: MongoClient = new MongoClient(process.env.MONGO_URI as string);

    await db.connect();

    process.stdout.moveCursor(0, -1);
    process.stdout.clearLine(1);
    this.dbLog(`Connected: ${this.config.database}`);
    return this.db = db.db(this.config.database);
  }

  async start(token = this.options.token || process.env.TOKEN): Promise<void> {
    if (!token) return this.error("No token was provided.");

    Object.keys(Methods).forEach(key => (this[key] = Methods[key]));

    this.handlers = {
      loadEvents, loadCommands
    };

    await this.loadLogger();
    await this.initDatabase();
    await loadEvents(this);
    await loadCommands(this);

    super.login(token);
  }
}

export const Intents = Object.keys(Discord.Intents.FLAGS).filter(x => ![].includes(x)).map(x => Discord.Intents.FLAGS[x]);
