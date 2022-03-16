import { SlashCommandOptionString, SlashCommandSubcommand } from "petal";
import { CONSTANTS } from "../../../../../lib/constants";
import autocomplete from "../../autocomplete/titleUseAutocomplete";
import run from "./titleUseRun";

export const TitleUse: SlashCommandSubcommand = {
  type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
  name: "use",
  description: "sets a title as your active title",
  options: [
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "title",
      description: "the title to set as your active title",
      required: true,
      autocomplete: true,
      runAutocomplete: autocomplete,
    } as SlashCommandOptionString,
  ],
  run,
};
