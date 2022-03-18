import { SlashCommandSubcommand } from "petal";
import { CONSTANTS } from "../../../../../../lib/constants";
import { shopBuyRun } from "./shopBuyRun";

export const ShopBuy: SlashCommandSubcommand = {
  type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
  name: "buy",
  description: "purchase an item!",
  options: [
    {
      type: CONSTANTS.OPTION_TYPE.INTEGER,
      name: "item",
      description: "the option you'd like to purchase!",
      required: true,
    },
  ],
  ephemeral: true,
  run: shopBuyRun,
};
