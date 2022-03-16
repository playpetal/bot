import { SlashCommandOptionString, SlashCommandSubcommand } from "petal";
import { CONSTANTS } from "../../../../../../lib/constants";
import autocomplete from "../../autocomplete/prefabAutocomplete";
import run from "./prefabCreateRun";

export const PrefabCreate: SlashCommandSubcommand = {
  type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
  name: "create",
  description: "create a prefab",
  options: [
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "character",
      description: "the character you'd like to set the prefab to",
      required: true,
      autocomplete: true,
      runAutocomplete: autocomplete,
    } as SlashCommandOptionString,
    {
      type: CONSTANTS.OPTION_TYPE.ATTACHMENT,
      name: "image",
      description: "the image of the prefab you'd like to create",
      required: true,
    },
    {
      type: CONSTANTS.OPTION_TYPE.INTEGER,
      name: "release",
      description:
        "the release to put the prefab in. if empty, creates new release or adds to last undroppable release.",
    },
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "subgroup",
      description: "the subgroup you'd like to set the prefab to",
      autocomplete: true,
      runAutocomplete: autocomplete,
    } as SlashCommandOptionString,
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "group",
      description: "the group you'd like to set the prefab to",
      autocomplete: true,
      runAutocomplete: autocomplete,
    } as SlashCommandOptionString,
    {
      type: CONSTANTS.OPTION_TYPE.NUMBER,
      name: "max_cards",
      description: "the max cards of the prefab",
    },
    {
      type: CONSTANTS.OPTION_TYPE.NUMBER,
      name: "rarity",
      description: "the relative rarity of the prefab (currently unused)",
    },
  ],
  run,
};
