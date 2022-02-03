import { Client } from "eris";
import { loadComponents } from "../lib/loaders/loadComponents";
import { loadEvents } from "../lib/loaders/loadEvents";
import { loadSlashCommands } from "../lib/loaders/loadSlashCommands";
import { SlashCommand } from "./command";
import { Component } from "./component";

export class Bot extends Client {
  public commands: SlashCommand[] = [];
  public components: Component[] = [];

  async start() {
    await loadEvents();
    this.components = await loadComponents();
    this.commands = await loadSlashCommands();
  }
}
