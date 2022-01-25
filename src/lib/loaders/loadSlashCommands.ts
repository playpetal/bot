import glob from "glob-promise";
import path from "path";
import { SlashCommand } from "../../struct/command";

export async function loadSlashCommands() {
  const dir = path.join(__dirname, "../../commands");
  const matches = await glob(`${dir}/**/*.ts`);

  const commands: SlashCommand[] = [];

  for (let match of matches) {
    try {
      const command = require(match).default as SlashCommand;

      if (match.includes("commands/_mod")) command.modOnly = true;

      commands.push(command);
    } catch (e) {
      console.error(`Command failed to load at ${match}\n${e}`);
    }
  }

  return commands;
}
