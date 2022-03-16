import { SlashCommandSubcommand } from "petal";
import { CONSTANTS } from "../../../../../lib/constants";
import run from "./titlesCreateRun";

export const TitlesCreate: SlashCommandSubcommand = {
  type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
  name: "create",
  description: "creates a new title",
  options: [
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "title",
      description: "the name of the title",
      required: true,
    },
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "description",
      description: "the description of the title",
    },
  ],
  run,
};
