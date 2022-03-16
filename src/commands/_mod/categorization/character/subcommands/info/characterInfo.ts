import { SlashCommandOptionString, SlashCommandSubcommand } from "petal";
import { CONSTANTS } from "../../../../../../lib/constants";
import autocomplete from "../../autocomplete/characterAutocomplete";
import run from "./characterInfoRun";

export const CharacterInfo: SlashCommandSubcommand = {
  type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
  name: "info",
  description: "shows information about a character",
  options: [
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "character",
      description: "the character you'd like to view information about",
      required: true,
      runAutocomplete: autocomplete,
    } as SlashCommandOptionString,
  ],
  run,
};
