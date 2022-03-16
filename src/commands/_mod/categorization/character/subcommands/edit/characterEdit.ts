import { SlashCommandOptionString, SlashCommandSubcommand } from "petal";
import { CONSTANTS } from "../../../../../../lib/constants";
import autocomplete from "../../autocomplete/characterAutocomplete";
import run from "./characterEditRun";

export const CharacterEdit: SlashCommandSubcommand = {
  type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
  name: "edit",
  description: "edits a character",
  options: [
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "character",
      description: "the name of the character you'd like to edit",
      required: true,
      autocomplete: true,
      runAutocomplete: autocomplete,
    } as SlashCommandOptionString,
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "name",
      description: "the name of the character",
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
