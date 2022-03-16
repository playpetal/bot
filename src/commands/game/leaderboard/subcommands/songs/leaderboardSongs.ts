import { SlashCommandSubcommand } from "petal";
import { CONSTANTS } from "../../../../../lib/constants";
import run from "./leaderboardSongsRun";

export const LeaderboardSongs: SlashCommandSubcommand = {
  type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
  name: "songs",
  description: "show leaderboards for 'guess the song'",
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
