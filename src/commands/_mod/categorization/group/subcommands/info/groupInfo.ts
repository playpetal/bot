import { SlashCommandOptionString, SlashCommandSubcommand } from "petal";
import { CONSTANTS } from "../../../../../../lib/constants";
import autocomplete from "../../autocomplete/groupAutocomplete";
import run from "./groupInfoRun";

export const GroupInfo: SlashCommandSubcommand = {
  type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
  name: "info",
  description: "shows information about a group",
  options: [
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "group",
      description: "the group you'd like to view information about",
      required: true,
      autocomplete: true,
      runAutocomplete: autocomplete,
    } as SlashCommandOptionString,
  ],
  run,
};
