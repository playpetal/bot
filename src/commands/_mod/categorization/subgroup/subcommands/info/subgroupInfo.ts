import { SlashCommandOptionString, SlashCommandSubcommand } from "petal";
import { CONSTANTS } from "../../../../../../lib/constants";
import autocomplete from "../../autocomplete/subgroupAutocomplete";
import run from "./subgroupInfoRun";

export const SubgroupInfo: SlashCommandSubcommand = {
  type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
  name: "info",
  description: "view information about a subgroup",
  options: [
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "subgroup",
      description: "the subgroup you'd like to view",
      required: true,
      autocomplete: true,
      runAutocomplete: autocomplete,
    } as SlashCommandOptionString,
  ],
  run,
};
