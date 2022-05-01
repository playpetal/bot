import { SlashCommandSubcommand } from "petal";
import { CONSTANTS } from "../../../../../lib/constants";
import { biasListRun } from "./biasListRun";

export const BiasList: SlashCommandSubcommand = {
  type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
  name: "list",
  description: "shows a list of someone's favorite groups",
  options: [
    {
      type: CONSTANTS.OPTION_TYPE.USER,
      name: "user",
      description: "the user whose bias list you'd like to view",
    },
  ],
  run: biasListRun,
};
