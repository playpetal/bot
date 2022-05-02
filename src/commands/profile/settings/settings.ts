import { slashCommand } from "../../../lib/command";
import { CONSTANTS } from "../../../lib/constants";
import run from "./settingsRun";

export default slashCommand("settings")
  .desc("you can use this command to change certain settings!")
  .option({
    type: CONSTANTS.OPTION_TYPE.SUBCOMMAND_GROUP,
    name: "toggle",
    description: "opt into or out of something",
    options: [
      {
        type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
        name: "public-supporter",
        description: "toggle your supporter statistics being shown publicly",
        run,
      },
      {
        type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
        name: "minigames-use-bias-list",
        description:
          "toggles whether or not minigames should be based on your bias list",
        run,
      },
    ],
  })
  .run(run);
