import { SlashCommandOptionString, SlashCommandSubcommand } from "petal";
import { CONSTANTS } from "../../../../../../../lib/constants";
import autocomplete from "../../../../autocomplete/titlesAutocomplete";
import run from "./titlesGrantUserRun";

export const TitlesGrantUser: SlashCommandSubcommand = {
  type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
  name: "user",
  description: "grants a title to a specific user",
  options: [
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "title",
      description: "the title to give",
      required: true,
      autocomplete: true,
      runAutocomplete: autocomplete,
    } as SlashCommandOptionString,
    {
      type: CONSTANTS.OPTION_TYPE.USER,
      name: "user",
      description: "the user to give the title to",
      required: true,
    },
  ],
  run,
};
