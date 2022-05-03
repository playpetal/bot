import { SlashCommandOptionString, SlashCommandSubcommand } from "petal";
import { CONSTANTS } from "../../../../../lib/constants";
import { autocompleteGroup } from "../../../cards/inventory/autocomplete/group";
import { triviaPlayRun } from "./triviaPlayRun";

export const TriviaPlay: SlashCommandSubcommand = {
  type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
  name: "play",
  description: "starts a new game of trivia!",
  options: [
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "gender",
      description: "limits your question to only boy or girl groups",
      choices: [
        { name: "boys", value: "male" },
        { name: "girls", value: "female" },
      ],
    },
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "group",
      description:
        "limits your question to a specific group (overrides bias list)",
      autocomplete: true,
      runAutocomplete: autocompleteGroup,
    } as SlashCommandOptionString,
  ],
  run: triviaPlayRun,
};
