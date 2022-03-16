import { SlashCommandOptionString, SlashCommandSubcommand } from "petal";
import { CONSTANTS } from "../../../../../../lib/constants";
import autocomplete from "../../autocomplete/cardAutocomplete";
import run from "./cardViewRun";

export const CardView: SlashCommandSubcommand = {
  type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
  name: "view",
  description: "shows information about a card",
  options: [
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "card",
      description: "the card you'd like to view",
      required: true,
      autocomplete: true,
      runAutocomplete: autocomplete,
    } as SlashCommandOptionString,
  ],
  run,
};
