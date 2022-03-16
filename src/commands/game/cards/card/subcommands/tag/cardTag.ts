import { SlashCommandOptionString, SlashCommandSubcommand } from "petal";
import { CONSTANTS } from "../../../../../../lib/constants";
import { default as cardAutocomplete } from "../../autocomplete/cardAutocomplete";
import { default as tagAutocomplete } from "../../autocomplete/cardTagAutocomplete";
import run from "./cardTagRun";

export const CardTag: SlashCommandSubcommand = {
  type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
  name: "tag",
  description: "sets or changes a tag to one of your cards",
  options: [
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "card",
      description: "the card you'd like to add the tag to",
      required: true,
      autocomplete: true,
      runAutocomplete: cardAutocomplete,
    } as SlashCommandOptionString,
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "tag",
      description: "the tag you'd like to add to your card",
      required: true,
      autocomplete: true,
      runAutocomplete: tagAutocomplete,
    } as SlashCommandOptionString,
  ],
  run,
};
