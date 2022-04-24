import {
  AnySlashCommandOption,
  DiscordCreateApplicationCommandOption,
  SlashCommandOptionNumeric,
  SlashCommandOptionType,
} from "petal";
import { isSubcommand, isSubcommandGroup } from ".";
import { CONSTANTS } from "../constants";

export function convertOptions(
  options: AnySlashCommandOption[]
): DiscordCreateApplicationCommandOption<SlashCommandOptionType>[] {
  const converted: DiscordCreateApplicationCommandOption<SlashCommandOptionType>[] =
    [];

  for (let option of options) {
    const conversion: DiscordCreateApplicationCommandOption<SlashCommandOptionType> =
      {
        type: option.type,
        name: option.name,
        description: option.description,
      };

    if (
      option.type === CONSTANTS.OPTION_TYPE.STRING ||
      option.type === CONSTANTS.OPTION_TYPE.INTEGER ||
      option.type === CONSTANTS.OPTION_TYPE.NUMBER
    ) {
      if (option.type !== CONSTANTS.OPTION_TYPE.STRING) {
        conversion.min_value = (option as SlashCommandOptionNumeric).min_value;
        conversion.max_value = (option as SlashCommandOptionNumeric).max_value;
      }
      conversion.choices = option.choices;
    }

    if (!isSubcommand(option) && !isSubcommandGroup(option)) {
      conversion.required = option.required;
      conversion.autocomplete = option.autocomplete;
    } else if (option.options) {
      const opts = convertOptions(option.options);
      conversion.options = opts;
    }

    converted.push(conversion);
  }

  return converted;
}
