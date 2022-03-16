import { SlashCommandSubcommand } from "petal";
import { CONSTANTS } from "../../../../../../lib/constants";
import run from "./subgroupCreateRun";

export const SubgroupCreate: SlashCommandSubcommand = {
  type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
  name: "create",
  description: "creates a subgroup",
  options: [
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "name",
      description: "the name of the subgroup",
      required: true,
    },
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "creation",
      description:
        "the date that the subgroup was created (release date, etc.)",
    },
  ],
  run,
};
