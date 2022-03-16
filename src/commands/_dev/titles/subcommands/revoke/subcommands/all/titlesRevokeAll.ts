import { SlashCommandOptionString, SlashCommandSubcommand } from "petal";
import { CONSTANTS } from "../../../../../../../lib/constants";
import autocomplete from "../../../../autocomplete/titlesAutocomplete";
import run from "./titlesRevokeAllRun";

export const TitlesRevokeAll: SlashCommandSubcommand = {
  type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
  name: "all",
  description: "revokes a title from all existing players",
  options: [
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "title",
      description: "the title to revoke",
      required: true,
      autocomplete: true,
      runAutocomplete: autocomplete,
    } as SlashCommandOptionString,
  ],
  run,
};
