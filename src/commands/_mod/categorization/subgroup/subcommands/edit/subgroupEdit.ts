import { SlashCommandOptionString, SlashCommandSubcommand } from "petal";
import { CONSTANTS } from "../../../../../../lib/constants";
import autocomplete from "../../autocomplete/subgroupAutocomplete";
import run from "./subgroupEditRun";

export const SubgroupEdit: SlashCommandSubcommand = {
  type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
  name: "edit",
  description: "edits a subgroup",
  options: [
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "subgroup",
      description: "the subgroup you'd like to edit",
      required: true,
      autocomplete: true,
      runAutocomplete: autocomplete,
    } as SlashCommandOptionString,
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "name",
      description: "the new name of the subgroup",
    },
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "creation",
      description: "the new creation date of the subgroup",
    },
  ],
  run,
};
