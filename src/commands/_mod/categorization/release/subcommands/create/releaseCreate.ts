import { SlashCommandSubcommand } from "petal";
import { CONSTANTS } from "../../../../../../lib/constants";
import run from "./releaseCreateRun";

export const ReleaseCreate: SlashCommandSubcommand = {
  type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
  name: "create",
  description: "creates a release",
  run,
};
