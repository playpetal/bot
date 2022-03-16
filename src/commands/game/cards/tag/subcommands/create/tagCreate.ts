import { SlashCommandSubcommand } from "petal";
import { CONSTANTS } from "../../../../../../lib/constants";
import run from "./tagCreateRun";

export const TagCreate: SlashCommandSubcommand = {
  type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
  name: "create",
  description: "creates a new tag (maximum of 5 at the moment!)",
  options: [
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "name",
      description: "the name of the tag you want to create",
      required: true,
    },
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "emoji",
      description: "the emoji you want to attach to your tag",
      required: true,
    },
  ],
  run,
};
