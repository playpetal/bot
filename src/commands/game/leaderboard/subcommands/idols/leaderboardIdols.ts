import { SlashCommandSubcommand } from "petal";
import { CONSTANTS } from "../../../../../lib/constants";
import run from "./leaderboardIdolsRun";

export const LeaderboardIdols: SlashCommandSubcommand = {
  type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
  name: "idols",
  description: "show leaderboards for 'guess the idol'",
  options: [
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "board",
      description: "the leaderboard you want to view",
      choices: [
        { name: "time", value: "time" },
        { name: "petals", value: "petals" },
        { name: "lilies", value: "lilies" },
        { name: "cards", value: "cards" },
      ],
      required: true,
    },
  ],
  run,
};
