import { Client } from "eris";
import { gts } from "../lib/fun/gts";
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

    setInterval(async () => {
      if ((await gts.getStackLength()) < 100) await gts.requestSong();
    }, 5000);
  }
}
