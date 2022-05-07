import { slashCommand } from "../../../lib/command";
import { CONSTANTS } from "../../../lib/constants";
import { help } from "../../../lib/help/topics";
import { helpRun } from "./helpRun";

export default slashCommand("help")
  .desc("confused? need some help? this command might have the answer!")
  .option({
    type: CONSTANTS.OPTION_TYPE.STRING,
    name: "topic",
    description:
      "a topic that you need help with, or want to view more information about",
    choices: Object.keys(help)
      .map((t) => {
        return { name: t, value: t };
      })
      .slice(0, 25),
  })
  .run(helpRun);
