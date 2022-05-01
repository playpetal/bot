import { SlashCommandOptionString, SlashCommandSubcommand } from "petal";
import { CONSTANTS } from "../../../../../lib/constants";
import { autocompleteBias } from "../../autocomplete/autocompleteBias";
import { biasRemoveRun } from "./biasRemoveRun";

export const BiasRemove: SlashCommandSubcommand = {
  type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
  name: "remove",
  description: "removes a group from your bias list!",
  options: [
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "group",
      description: "the group you'd like to remove from your bias list",
      required: true,
      autocomplete: true,
      runAutocomplete: autocompleteBias,
    } as SlashCommandOptionString,
  ],
  run: biasRemoveRun,
};
