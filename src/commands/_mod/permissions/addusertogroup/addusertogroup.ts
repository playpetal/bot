import { SlashCommandOptionString } from "petal";
import { slashCommand } from "../../../../lib/command";
import { CONSTANTS } from "../../../../lib/constants";
import run from "./addusertogroupRun";
import autocomplete from "./autocomplete/addusertogroupAutocomplete";

export default slashCommand("addusertogroup")
  .desc("adds a user to a user group")
  .run(run)
  .option({
    type: CONSTANTS.OPTION_TYPE.USER,
    name: "user",
    description: "the user you'd like to add to the group",
    required: true,
  })
  .option({
    type: CONSTANTS.OPTION_TYPE.STRING,
    name: "group",
    description: "the group you'd like to add the user to",
    required: true,
    autocomplete: true,
    runAutocomplete: autocomplete,
  } as SlashCommandOptionString);
