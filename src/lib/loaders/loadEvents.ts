import glob from "glob-promise";
import path from "path";
import { bot } from "../..";
import { Event } from "../../struct/event";

export async function loadEvents(): Promise<void> {
  const dir = path.join(__dirname, "../../events");
  const matches = await glob(`${dir}/**/*.ts`);

  for (let match of matches) {
    try {
      const event = require(match).default as Event;

      for (let clientEvent of event.events) {
        bot.on(clientEvent, event.run);
      }
    } catch (e) {
      console.log(`Failed to load event at ${match}:\n${e}`);
    }
  }
}
