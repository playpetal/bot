import { slashCommand } from "../../../lib/command";
import { TriviaPlay } from "./subcommands/play/triviaPlay";

export default slashCommand("trivia").desc("trivia").option(TriviaPlay);
