import glob from "glob-promise";
import path from "path";
import { bot } from "../..";
import { Event } from "../../struct/event";
import { logger } from "../logger";

export async function loadEvents(): Promise<void> {
  const dir = path.join(__dirname, "../../events");
  const matches = await glob(`${dir}/**/*.[jt]s`);

  for (let match of matches) {
    try {
      const event = require(match).default as unknown;

      if (!(event instanceof Event)) continue;

      for (let clientEvent of event.events) {
        bot.on(clientEvent, event.run);
      }
    } catch (e) {
      logger.error(`Failed to load event at ${match}:\n${e}`);
    }
  }
}
