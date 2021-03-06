import glob from "glob-promise";
import path from "path";
import { bot } from "../..";
import { Modal } from "../../struct/modal";
import { logger } from "../logger";

export async function loadModals() {
  const dir = path.join(__dirname, "../../components/modals");
  const matches = await glob(`${dir}/**/*.[jt]s`);

  const modals: Modal[] = [];

  for (let match of matches) {
    try {
      const modal = require(match).default as unknown;

      if (!(modal instanceof Modal)) continue;

      modals.push(modal);
    } catch (e) {
      logger.error(`Component failed to load at ${match}\n${e}`);
    }
  }

  bot.modals = modals;
  return;
}
