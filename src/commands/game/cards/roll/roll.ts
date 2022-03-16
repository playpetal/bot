import { slashCommand } from "../../../../lib/command";
import { CONSTANTS } from "../../../../lib/constants";
import run from "./rollRun";

export default slashCommand("roll")
  .desc("rolls for a random card")
  .option({
    type: CONSTANTS.OPTION_TYPE.INTEGER,
    name: "amount",
    description: "how many cards you want to roll",
    min_value: 1,
    max_value: 10,
  })
  .option({
    type: CONSTANTS.OPTION_TYPE.STRING,
    name: "gender",
    description: "only roll cards of this gender (costs more)",
    choices: [
      { name: "male", value: "MALE" },
      { name: "female", value: "FEMALE" },
    ],
  })
  .run(run);
