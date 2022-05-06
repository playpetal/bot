import { SlashCommandSubcommand } from "petal";
import { CONSTANTS } from "../../../../../lib/constants";
import { suggestCardsRun } from "./suggestCardsRun";

export const SuggestCards: SlashCommandSubcommand = {
  type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
  name: "cards",
  description: "suggests a new set of cards to add to petal!",
  run: suggestCardsRun,
};
