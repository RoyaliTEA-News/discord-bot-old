import { Collection } from "discord.js";
import { Dirent, existsSync, readdirSync } from "fs";

export default class ModuleManager {
  client: Bot;

  events = new Collection<string, Event>();
  modules = new Collection<string, Dirent>();
  aliases = new Collection<string, Command>();
  commands = new Collection<string, Command>();

  constructor(client) {
    this.client = client;
  }

  async loadModules(): Promise<boolean> {
    const modules = readdirSync(`${process.cwd()}/dist/modules/`, { withFileTypes: true })
      .filter(x => x.isDirectory());

    for (const module of modules) {
      this.modules.set(module.name, module);

      if (existsSync(`${process.cwd()}/dist/modules/${module.name}/events`)) {
        const events = readdirSync(`${process.cwd()}/dist/modules/${module.name}/events`);

        for (const event of events)
          await this.loadEvent(module.name, event);
      }

      if (existsSync(`${process.cwd()}/dist/modules/${module.name}/commands`)) {
        const commands = readdirSync(`${process.cwd()}/dist/modules/${module.name}/commands`);

        for (const command of commands)
          await this.loadCommand(module.name, command);
      }
    }

    return true;
  }

  async getModules(): Promise<Collection<string, Dirent>> {
    return this.modules;
  }

  async loadCommand(module, name): Promise<boolean> {
    const command = await import(`${process.cwd()}/dist/modules/${module}/commands/${name}`);

    command.module = module;

    this.commands.set(name.split(".js")[0], command);

    for (const alias of command.aliases || [])
      this.aliases.set(alias, command);

    return true;
  }

  async loadEvent(module, name): Promise<boolean> {
    const event = await import(`${process.cwd()}/dist/modules/${module}/events/${name}`),
      eventTypes = {
        client: this.client,
        process
      };

    event.module = module;

    this.events.set(name, event);

    eventTypes[event.type || "client"].on(event.name, (...args) => event.execute(this.client, ...args));

    return true;
  }
}
