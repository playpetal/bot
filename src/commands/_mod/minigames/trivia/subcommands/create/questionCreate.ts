import { SlashCommandOptionString, SlashCommandSubcommand } from "petal";
import { CONSTANTS } from "../../../../../../lib/constants";
import { autocompleteGroup } from "../../../../../game/cards/inventory/autocomplete/group";
import { questionCreateRun } from "./questionCreateRun";

export const QuestionCreate: SlashCommandSubcommand = {
  type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
  name: "create",
  description: "creates a new trivia question",
  options: [
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "group",
      description: "the group the trivia applies to",
      autocomplete: true,
      runAutocomplete: autocompleteGroup,
      required: true,
    } as SlashCommandOptionString,
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "question",
      description: "the question to ask the player",
      required: true,
    },
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "answer",
      description: "the correct answer to the trivia question",
      required: true,
    },
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "fake1",
      description: 'a "fake" answer to the trivia question',
      required: true,
    },
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "fake2",
      description: 'a "fake" answer to the trivia question',
      required: true,
    },
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "fake3",
      description: 'a "fake" answer to the trivia question',
      required: true,
    },
  ],
  run: questionCreateRun,
};
