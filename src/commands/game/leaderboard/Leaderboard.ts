import { slashCommand } from "../../../lib/command";
import { LeaderboardSongs } from "./subcommands/songs/leaderboardSongs";
import { LeaderboardSupporters } from "./subcommands/supporters/leaderboardSupporters";

export default slashCommand("leaderboard")
  .option(LeaderboardSongs)
  .option(LeaderboardSupporters);
