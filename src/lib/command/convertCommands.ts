import { DiscordCreateApplicationCommand } from "petal";
import { SlashCommand } from "../../struct/command";
import { convertOptions } from "./convertOptions";

export function convertCommands(
  commands: SlashCommand[]
): DiscordCreateApplicationCommand[] {
  const converted: DiscordCreateApplicationCommand[] = [];

  for (let command of commands) {
    const conversion: DiscordCreateApplicationCommand = {
      type: command.type,
      name: command.name,
      description: command.description,
    };

    if (command.options.length > 0) {
      conversion.options = convertOptions(command.options);
    }

    converted.push(conversion);
  }

  return converted;
}
