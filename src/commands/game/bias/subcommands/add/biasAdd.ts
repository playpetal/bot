import { SlashCommandOptionString, SlashCommandSubcommand } from "petal";
import { CONSTANTS } from "../../../../../lib/constants";
import { autocompleteGroup } from "../../../cards/inventory/autocomplete/group";
import { biasAddRun } from "./biasAddRun";

export const BiasAdd: SlashCommandSubcommand = {
  type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
  name: "add",
  description: "adds a group to your bias list!",
  options: [
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "group",
      description: "the group you'd like to add to your bias list",
      required: true,
      autocomplete: true,
      runAutocomplete: autocompleteGroup,
    } as SlashCommandOptionString,
  ],
  run: biasAddRun,
};
