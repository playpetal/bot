import glob from "glob-promise";
import path from "path";
import { bot } from "../..";
import { SlashCommand } from "../../struct/command";

export async function loadSlashCommands() {
  const dir = path.join(__dirname, "../../commands");
  const matches = await glob(`${dir}/**/*.[jt]s`);

  const commands: SlashCommand[] = [];

  for (let match of matches) {
    const command = require(match).default as unknown;

    if (!(command instanceof SlashCommand)) continue;

    if (match.includes("commands/_mod")) command.modOnly(true);

    commands.push(command);
  }

  bot.commands = commands;
  return;
}
