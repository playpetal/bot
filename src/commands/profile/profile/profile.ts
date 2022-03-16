import { slashCommand } from "../../../lib/command";
import { CONSTANTS } from "../../../lib/constants";
import run from "./profileRun";

export default slashCommand("profile")
  .desc("view someone's profile")
  .option({
    type: CONSTANTS.OPTION_TYPE.USER,
    name: "user",
    description: "the user whose profile you'd like to view",
  })
  .run(run);
