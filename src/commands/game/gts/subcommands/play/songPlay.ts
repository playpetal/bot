import { SlashCommandSubcommand } from "petal";
import { CONSTANTS } from "../../../../../lib/constants";
import run from "./songPlayRun";

export const SongPlay: SlashCommandSubcommand = {
  type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
  name: "play",
  description: "starts a new guess the song game!",
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
  run,
};
