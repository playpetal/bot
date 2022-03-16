import { SlashCommandSubcommand } from "petal";
import { CONSTANTS } from "../../../../../lib/constants";
import run from "./wordsGuessRun";

export const PetleGuess: SlashCommandSubcommand = {
  type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
  name: "guess",
  description: "guess a word",
  options: [
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "word",
      description: "the word you want to guess",
      required: true,
    },
  ],
  ephemeral: true,
  run,
};
