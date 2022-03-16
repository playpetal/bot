import { slashCommand } from "../../../lib/command";
import { SongGuess } from "./subcommands/guess/songGuess";
import { SongPlay } from "./subcommands/play/songPlay";

export default slashCommand("song")
  .desc("gts")
  .option(SongPlay)
  .option(SongGuess);
