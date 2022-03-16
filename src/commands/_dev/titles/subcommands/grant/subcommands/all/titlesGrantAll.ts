import { SlashCommandOptionString, SlashCommandSubcommand } from "petal";
import { CONSTANTS } from "../../../../../../../lib/constants";
import autocomplete from "../../../../autocomplete/titlesAutocomplete";
import run from "./titlesGrantAllRun";

export const TitlesGrantAll: SlashCommandSubcommand = {
  type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
  name: "all",
  description: "grants a title to all existing players",
  options: [
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "title",
      description: "the title to give",
      required: true,
      autocomplete: true,
      runAutocomplete: autocomplete,
    } as SlashCommandOptionString,
  ],
  run,
};
