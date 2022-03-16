import { SlashCommandSubcommand } from "petal";
import { CONSTANTS } from "../../../../../../lib/constants";
import run from "./releaseEditRun";

export const ReleaseEdit: SlashCommandSubcommand = {
  type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
  name: "edit",
  description: "edits a release",
  options: [
    {
      type: CONSTANTS.OPTION_TYPE.INTEGER,
      name: "release",
      description: "the release you'd like to edit",
      required: true,
    },
    {
      type: CONSTANTS.OPTION_TYPE.BOOLEAN,
      name: "droppable",
      description: "if the release should be droppable",
    },
  ],
  run,
};
