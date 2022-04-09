import { SlashCommandOptionString, SlashCommandSubcommand } from "petal";
import { CONSTANTS } from "../../../../../../lib/constants";
import autocomplete from "../../autocomplete/cardAutocomplete";
import run from "./cardDyeRun";

export const CardDye: SlashCommandSubcommand = {
  type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
  name: "dye",
  description: "changes the color of the card! (costs 1 lily)",
  options: [
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "card",
      description: "the card you'd like to color",
      required: true,
      autocomplete: true,
      runAutocomplete: autocomplete,
    } as SlashCommandOptionString,
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "color",
      description: "the hex code of the color",
      required: true,
    },
  ],
  run,
};
