import { ApplicationCommandStructure } from "eris";
import {
  AnySlashCommandOption,
  SlashCommandSubcommand,
  SlashCommandSubcommandGroup,
} from "petal";
import { bot } from "../..";
import { SlashCommand } from "../../struct/command";
import { CONSTANTS } from "../constants";
import { convertCommands } from "./convertCommands";

export function slashCommand(name: string) {
  return new SlashCommand(name);
}

export async function processCommands(
  commands: SlashCommand[],
  serverId?: string
): Promise<void> {
  const convertedCommands = convertCommands(commands);

  if (serverId) {
    await bot.bulkEditGuildCommands(
      serverId,
      convertedCommands as ApplicationCommandStructure[]
    );
  } else
    await bot.bulkEditCommands(
      convertedCommands as ApplicationCommandStructure[]
    );

  return;
}

export function isSubcommand(
  option: AnySlashCommandOption
): option is SlashCommandSubcommand {
  return option.type === CONSTANTS.OPTION_TYPE.SUBCOMMAND;
}

export function isSubcommandGroup(
  option: AnySlashCommandOption
): option is SlashCommandSubcommandGroup {
  return option.type == CONSTANTS.OPTION_TYPE.SUBCOMMAND_GROUP;
}
