import { SlashCommandSubcommand } from "petal";
import { CONSTANTS } from "../../../../../lib/constants";
import { leaderboardTriviaRun } from "./leaderboardTriviaRun";

export const LeaderboardTrivia: SlashCommandSubcommand = {
  type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
  name: "trivia",
  description: "show leaderboards for 'trivia'",
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
  run: leaderboardTriviaRun,
};
