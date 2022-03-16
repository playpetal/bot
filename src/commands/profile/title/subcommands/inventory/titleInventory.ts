import { SlashCommandSubcommand } from "petal";
import { CONSTANTS } from "../../../../../lib/constants";
import run from "./titleInventoryRun";

export const TitleInventory: SlashCommandSubcommand = {
  type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
  name: "inventory",
  description: "shows you a list of titles you own",
  run,
};
