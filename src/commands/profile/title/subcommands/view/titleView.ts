import { SlashCommandOptionString, SlashCommandSubcommand } from "petal";
import { CONSTANTS } from "../../../../../lib/constants";
import run from "./titleViewRun";
import autocomplete from "../../autocomplete/titleViewAutocomplete";

export const TitleView: SlashCommandSubcommand = {
  type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
  name: "view",
  description: "shows information about a title",
  options: [
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "title",
      description: "the title to view",
      required: true,
      autocomplete: true,
      runAutocomplete: autocomplete,
    } as SlashCommandOptionString,
  ],
  run,
};
