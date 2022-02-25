import glob from "glob-promise";
import path from "path";
import { bot } from "../..";
import { SlashCommand } from "../../struct/command";
import { logger } from "../logger";

export async function loadSlashCommands() {
  const dir = path.join(__dirname, "../../commands");
  const matches = await glob(`${dir}/**/*.[jt]s`);

  const commands: SlashCommand[] = [];

  for (let match of matches) {
    try {
      const command = require(match).default as unknown;

      if (!(command instanceof SlashCommand)) {
        continue;
      }

      if (match.includes("commands/_mod")) command.modOnly(true);

      commands.push(command);
    } catch (e) {
      logger.error(`Command failed to load at ${match}\n${e}`);
    }
  }

  bot.commands = commands;
  return;
}
