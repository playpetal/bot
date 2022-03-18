import { slashCommand } from "../../../lib/command";
import { CONSTANTS } from "../../../lib/constants";
import { pingRun } from "./pingRun";

export default slashCommand("ping")
  .desc("you can use this command to check if petal is online!")
  .option({
    type: CONSTANTS.OPTION_TYPE.BOOLEAN,
    name: "dev",
    description: "shows advanced connection stats",
  })
  .run(pingRun);
