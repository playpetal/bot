import glob from "glob-promise";
import path from "path";
import { SlashCommand } from "../../struct/command";

export async function loadSlashCommands() {
  const dir = path.join(__dirname, "../../commands");
  const tsMatches = await glob(`${dir}/**/*.ts`);
  const jsMatches = await glob(`${dir}/**/*.js`);

  const matches = [...tsMatches, ...jsMatches];

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
