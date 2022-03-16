import { SlashCommandSubcommand } from "petal";
import { CONSTANTS } from "../../../../../../lib/constants";
import run from "./characterCreateRun";

export const CharacterCreate: SlashCommandSubcommand = {
  type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
  name: "create",
  description: "creates a new character",
  options: [
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "name",
      description: "the name of the character",
      required: true,
    },
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "birthday",
      description: "the birthday of the character",
    },
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "gender",
      description: "the gender of the character",
      choices: [
        { name: "male", value: "male" },
        { name: "female", value: "female" },
        { name: "nonbinary", value: "nonbinary" },
      ],
    },
  ],
  run,
};
