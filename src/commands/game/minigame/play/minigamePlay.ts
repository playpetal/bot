import { SlashCommandOption, SlashCommandSubcommand } from "petal";
import { CONSTANTS } from "../../../../lib/constants";
import { autocompleteGroup } from "../../cards/inventory/autocomplete/group";
import { minigamePlayRun } from "./minigamePlayRun";

export const MinigamePlay: SlashCommandSubcommand = {
  type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
  name: "play",
  description: "you can play various minigames in petal to earn rewards!",
  options: [
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "minigame",
      description: "the minigame you'd like to play",
      choices: [{ name: "idols", value: "idols" }],
      required: true,
    },
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "gender",
      description:
        "restricts minigames to only give a certain gender as answers",
      choices: [
        { name: "male", value: "male" },
        { name: "female", value: "female" },
      ],
    },
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "group",
      description:
        "restricts minigames to only give idols from a certain group as answers",
      autocomplete: true,
      runAutocomplete: autocompleteGroup,
    } as SlashCommandOption,
  ],
  run: minigamePlayRun,
};
