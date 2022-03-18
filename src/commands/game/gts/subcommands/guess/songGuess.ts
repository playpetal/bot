import { SlashCommandSubcommand } from "petal";
import { CONSTANTS } from "../../../../../lib/constants";
import { songGuessRun } from "./songGuessRun";

export const SongGuess: SlashCommandSubcommand = {
  type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
  name: "guess",
  description: "guess the name of the song!",
  options: [
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "guess",
      description:
        "use this to make your guess in the 'guess the song' minigame!",
      required: true,
    },
  ],
  ephemeral: true,
  run: songGuessRun,
};
