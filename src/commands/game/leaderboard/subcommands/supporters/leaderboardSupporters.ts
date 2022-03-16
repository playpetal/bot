import { SlashCommandSubcommand } from "petal";
import { CONSTANTS } from "../../../../../lib/constants";
import run from "./leaderboardSupportersRun";

export const LeaderboardSupporters: SlashCommandSubcommand = {
  type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
  name: "supporters",
  description: "shows a list of the top petal supporters!",
  run,
};
