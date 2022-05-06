import { slashCommand } from "../../../lib/command";
import { CONSTANTS } from "../../../lib/constants";
import { announceRun } from "./announceRun";

export default slashCommand("announce")
  .desc("announce something to the designated announcements channel")
  .option({
    type: CONSTANTS.OPTION_TYPE.STRING,
    name: "content",
    description: "the message to announce",
    required: true,
  })
  .option({
    type: CONSTANTS.OPTION_TYPE.BOOLEAN,
    name: "publish",
    description:
      "whether or not to publish the announcement to all following servers",
  })
  .run(announceRun)
  .modOnly(true);
