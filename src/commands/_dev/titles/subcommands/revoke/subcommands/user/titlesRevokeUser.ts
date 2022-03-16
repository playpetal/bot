import { SlashCommandOptionString, SlashCommandSubcommand } from "petal";
import { CONSTANTS } from "../../../../../../../lib/constants";
import autocomplete from "../../../../autocomplete/titlesAutocomplete";
import run from "./titlesRevokeUserRun";

export const TitlesRevokeUser: SlashCommandSubcommand = {
  type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
  name: "user",
  description: "revokes a title from a specific user",
  options: [
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "title",
      description: "the title to revoke",
      required: true,
      runAutocomplete: autocomplete,
    } as SlashCommandOptionString,
    {
      type: CONSTANTS.OPTION_TYPE.USER,
      name: "user",
      description: "the user to revoke the title from",
      required: true,
    },
  ],
  run,
};
