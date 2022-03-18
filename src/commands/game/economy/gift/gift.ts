import { slashCommand } from "../../../../lib/command";
import { CONSTANTS } from "../../../../lib/constants";
import { giftRun } from "./giftRun";

export default slashCommand("gift")
  .desc("gift cards or petals to another player!")
  .option({
    type: CONSTANTS.OPTION_TYPE.USER,
    name: "user",
    description: "the user you'd like to gift to",
    required: true,
  })
  .option({
    type: CONSTANTS.OPTION_TYPE.STRING,
    name: "cards",
    description: "the cards, separated by spaces, you'd like to gift",
  })
  .option({
    type: CONSTANTS.OPTION_TYPE.INTEGER,
    name: "petals",
    description: "the amount of petals you'd like to gift",
    min_value: 1,
  })
  .option({
    type: CONSTANTS.OPTION_TYPE.INTEGER,
    name: "lilies",
    description: "the amount of lilies you'd like to gift",
    min_value: 1,
  })
  .run(giftRun);
