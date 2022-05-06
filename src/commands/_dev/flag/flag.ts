import { slashCommand } from "../../../lib/command";
import { CONSTANTS } from "../../../lib/constants";
import { flagRun } from "./flagRun";

export default slashCommand("flag")
  .desc("toggles flags for a given user")
  .option({
    type: CONSTANTS.OPTION_TYPE.USER,
    name: "user",
    description: "the user to manipulate",
    required: true,
  })
  .option({
    type: CONSTANTS.OPTION_TYPE.STRING,
    name: "flag",
    description: "the flag to toggle",
    choices: [
      { name: "DEVELOPER", value: "DEVELOPER" },
      { name: "RELEASE_MANAGER", value: "RELEASE_MANAGER" },
      { name: "PUBLIC_SUPPORTER", value: "PUBLIC_SUPPORTER" },
      { name: "MINIGAMES_USE_BIAS_LIST", value: "MINIGAMES_USE_BIAS_LIST" },
      { name: "GAME_DESIGNER", value: "GAME_DESIGNER" },
    ],
    required: true,
  })
  .run(flagRun)
  .modOnly(true);
