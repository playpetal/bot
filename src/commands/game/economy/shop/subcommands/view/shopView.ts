import { SlashCommandSubcommand } from "petal";
import { CONSTANTS } from "../../../../../../lib/constants";
import { shopViewRun } from "./shopViewRun";

export const ShopView: SlashCommandSubcommand = {
  type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
  name: "view",
  description: "shows a list of purchasable items!",
  run: shopViewRun,
};
