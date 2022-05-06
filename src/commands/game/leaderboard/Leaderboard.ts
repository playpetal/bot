import { slashCommand } from "../../../lib/command";
import { LeaderboardIdols } from "./subcommands/idols/leaderboardIdols";
import { LeaderboardSongs } from "./subcommands/songs/leaderboardSongs";
import { LeaderboardSupporters } from "./subcommands/supporters/leaderboardSupporters";
import { LeaderboardTrivia } from "./subcommands/trivia/leaderboardTrivia";

export default slashCommand("leaderboard")
  .option(LeaderboardSongs)
  .option(LeaderboardIdols)
  .option(LeaderboardSupporters)
  .option(LeaderboardTrivia);
