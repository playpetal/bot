import { SlashCommandSubcommand } from "petal";
import { CONSTANTS } from "../../../../../../lib/constants";
import run from "./groupCreateRun";

export const GroupCreate: SlashCommandSubcommand = {
  type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
  name: "create",
  description: "create a new group",
  options: [
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "name",
      description: "the name of the group you want to create",
      required: true,
    },
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "creation",
      description: "the date your group was created (debut date, etc.)",
    },
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "gender",
      description: "the gender of your group",
      choices: [
        { name: "male", value: "male" },
        { name: "female", value: "female" },
        { name: "coed", value: "coed" },
      ],
    },
  ],
  run,
};
