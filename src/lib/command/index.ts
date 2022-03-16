import { ApplicationCommand, ApplicationCommandStructure } from "eris";
import { bot } from "../..";
import { SlashCommand } from "../../struct/command";
import { slashCommandEquals } from "../util/slashCommandEquals";

export function slashCommand(name: string) {
  return new SlashCommand(name);
}

export async function processCommands(
  commands: SlashCommand[],
  serverId?: string
): Promise<void> {
  // array of slash commands that have been added to Discord already
  let applicationCommands: ApplicationCommand[] = [];

  if (serverId) {
    applicationCommands = await bot.getGuildCommands(serverId);
  } else applicationCommands = await bot.getCommands();

  for (let cmd of applicationCommands) {
    const command = commands.find((c) => c.name === cmd.name);

    // if the command does not exist locally, delete it from Discord
    if (!command) {
      if (serverId) {
        await bot.deleteGuildCommand(serverId, cmd.id);
      } else await bot.deleteCommand(cmd.id);

      continue;
    }

    // check for slash command equality in name, description, and options
    const isEqual = slashCommandEquals(command, cmd);

    if (!isEqual) {
      const _command = command as ApplicationCommandStructure;

      if (serverId) {
        await bot.editGuildCommand(serverId, cmd.id, _command);
      } else await bot.editCommand(cmd.id, _command);
    }
  }

  // filter for 'new' commands that exist locally, but not on Discord
  const newCommands = commands.filter(
    (c) => !applicationCommands.find((g) => g.name === c.name)
  );

  for (let command of newCommands) {
    const _command = command as ApplicationCommandStructure;

    if (serverId) {
      await bot.createGuildCommand(serverId, _command);
    } else await bot.createCommand(_command);
  }

  return;
}
