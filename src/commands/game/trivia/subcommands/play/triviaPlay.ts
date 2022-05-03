import { SlashCommandSubcommand } from "petal";
import { CONSTANTS } from "../../../../../lib/constants";
import { triviaPlayRun } from "./triviaPlayRun";

export const TriviaPlay: SlashCommandSubcommand = {
  type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
  name: "play",
  description: "starts a new game of trivia!",
  options: [
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "gender",
      description: "limits your song to only boy or girl groups",
      choices: [
        { name: "boys", value: "male" },
        { name: "girls", value: "female" },
      ],
    },
  ],
  run: triviaPlayRun,
};
