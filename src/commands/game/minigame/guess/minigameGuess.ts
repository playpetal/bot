import { SlashCommandOption, SlashCommandSubcommand } from "petal";
import { CONSTANTS } from "../../../../lib/constants";
import { minigameGuessAutocompleteIdol } from "./autocomplete/idol";
import { minigameGuessRun } from "./minigameGuessRun";

export const MinigameGuess: SlashCommandSubcommand = {
  type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
  name: "guess",
  description:
    "this command is used to make a guess in the minigame you're playing!",
  options: [
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "idol",
      description: "the idol you'd like to guess! can only be used in gti",
      autocomplete: true,
      runAutocomplete: minigameGuessAutocompleteIdol,
    } as SlashCommandOption,
  ],
  run: minigameGuessRun,
};
