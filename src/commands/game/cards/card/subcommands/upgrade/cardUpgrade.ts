import { SlashCommandOptionString, SlashCommandSubcommand } from "petal";
import { CONSTANTS } from "../../../../../../lib/constants";
import { cardUpgradeAutocomplete } from "../../autocomplete/cardUpgradeAutocomplete";
import { cardUpgradeRun } from "./cardUpgradeRun";

export const CardUpgrade: SlashCommandSubcommand = {
  type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
  name: "upgrade",
  description: "upgrades a card to the next level!",
  options: [
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "card",
      description: "the card you'd like to preserve and upgrade!",
      required: true,
      autocomplete: true,
      runAutocomplete: cardUpgradeAutocomplete,
    } as SlashCommandOptionString,
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "fodder",
      description: "the card to destroy and merge into your main card",
      required: true,
      autocomplete: true,
      runAutocomplete: cardUpgradeAutocomplete,
    },
  ],
  run: cardUpgradeRun,
};
