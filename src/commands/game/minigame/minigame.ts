import { slashCommand } from "../../../lib/command";
import { MinigameGuess } from "./guess/minigameGuess";
import { MinigamePlay } from "./play/minigamePlay";

export default slashCommand("minigame")
  .desc("you can play various minigames in petal to earn rewards!")
  .option(MinigamePlay)
  .option(MinigameGuess);
