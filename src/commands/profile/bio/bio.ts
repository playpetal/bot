import { slashCommand } from "../../../lib/command";
import { CONSTANTS } from "../../../lib/constants";
import run from "./bioRun";

export default slashCommand("bio")
  .desc("change the bio displayed on your profile")
  .option({
    type: CONSTANTS.OPTION_TYPE.STRING,
    name: "bio",
    description: "the text you'd like to change your bio to",
    required: true,
  })
  .run(run);
