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
    console.log("Starting...");
    console.log("Loading events...");
    await loadEvents();
    console.log("Loading components...");
    this.components = await loadComponents();
    console.log("Loading slash commands...");
    this.commands = await loadSlashCommands();
    console.log("All loaded");

    setInterval(async () => {
      try {
        if ((await gts.getStackLength()) < 100) await gts.requestSong();
      } catch (e) {
        // log later
      }
    }, 5000);
  }
}
