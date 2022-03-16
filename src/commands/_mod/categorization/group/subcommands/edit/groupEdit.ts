import { SlashCommandOptionString, SlashCommandSubcommand } from "petal";
import { CONSTANTS } from "../../../../../../lib/constants";
import autocomplete from "../../autocomplete/groupAutocomplete";
import run from "./groupEditRun";

export const GroupEdit: SlashCommandSubcommand = {
  type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
  name: "edit",
  description: "edits a group",
  options: [
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "group",
      description: "the group you want to edit",
      required: true,
      autocomplete: true,
      runAutocomplete: autocomplete,
    } as SlashCommandOptionString,
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "name",
      description: "the new name of the group",
    },
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "creation",
      description: "the new creation date of the group (debut date, etc.)",
    },
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "gender",
      description: "the new gender date of the group (debut date, etc.)",
      choices: [
        { name: "male", value: "male" },
        { name: "female", value: "female" },
        { name: "coed", value: "coed" },
      ],
    },
  ],
  run,
};
