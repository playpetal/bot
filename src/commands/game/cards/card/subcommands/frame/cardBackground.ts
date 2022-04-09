import { SlashCommandOptionString, SlashCommandSubcommand } from "petal";
import { CONSTANTS } from "../../../../../../lib/constants";
import autocomplete from "../../autocomplete/cardAutocomplete";
import cardFrameRun from "./cardBackgroundRun";

export const CardBackground: SlashCommandSubcommand = {
  type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
  name: "background",
  description: "changes the background of the card, in exchange for 1 lily",
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
      type: CONSTANTS.OPTION_TYPE.ATTACHMENT,
      name: "background",
      description: "the image of the background you'd like to add",
      required: true,
    },
  ],
  run: cardFrameRun,
};
