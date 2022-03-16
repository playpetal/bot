import { slashCommand } from "../../../lib/command";
import { CONSTANTS } from "../../../lib/constants";
import run from "./registerRun";

export default slashCommand("register")
  .desc("sign up with this command to start playing petal!")
  .option({
    type: CONSTANTS.OPTION_TYPE.STRING,
    name: "username",
    description:
      "your desired username. does not have to be your discord username!",
    required: true,
  })
  .run(run);
