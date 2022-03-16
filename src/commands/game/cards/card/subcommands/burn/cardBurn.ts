import { SlashCommandOptionString, SlashCommandSubcommand } from "petal";
import { CONSTANTS } from "../../../../../../lib/constants";
import autocomplete from "../../autocomplete/cardAutocomplete";
import run from "./cardBurnRun";

export const CardBurn: SlashCommandSubcommand = {
  type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
  name: "burn",
  description: "burns a card! will give you some petals in exchange",
  options: [
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "card",
      description: "the card you'd like to burn",
      required: true,
      autocomplete: true,
      runAutocomplete: autocomplete,
    } as SlashCommandOptionString,
  ],
  run,
};
