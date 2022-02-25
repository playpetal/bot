import { Client } from "eris";
import { loadComponents } from "../lib/loaders/loadComponents";
import { loadEvents } from "../lib/loaders/loadEvents";
import { loadModals } from "../lib/loaders/loadModals";
import { loadSlashCommands } from "../lib/loaders/loadSlashCommands";
import { SlashCommand } from "./command";
import { Component } from "./component";
import { Modal } from "./modal";

export class Bot extends Client {
  public commands: SlashCommand[] = [];
  public components: Component[] = [];
  public modals: Modal[] = [];

  async start() {
    await loadEvents();
    await loadComponents();
    await loadSlashCommands();
    await loadModals();
  }

  public findCommand(str: string): SlashCommand | undefined {
    return this.commands.find(
      (c) => c.name.toLowerCase() === str.toLowerCase()
    );
  }

  public findComponent(str: string): Component | undefined {
    return this.components.find(
      (c) => c.customId.toLowerCase() === str.split("?")[0].toLowerCase()
    );
  }

  public findModal(str: string): Modal | undefined {
    return this.modals.find(
      (m) => m.customId.toLowerCase() === str.split("?")[0].toLowerCase()
    );
  }
}
