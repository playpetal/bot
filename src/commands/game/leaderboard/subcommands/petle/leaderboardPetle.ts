import { SlashCommandSubcommand } from "petal";
import { CONSTANTS } from "../../../../../lib/constants";
import run from "./leaderboardPetleRun";

export const LeaderboardPetle: SlashCommandSubcommand = {
  type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
  name: "petle",
  description: "show leaderboards for 'petle'",
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
