import { SlashCommandOptionString, SlashCommandSubcommand } from "petal";
import { CONSTANTS } from "../../../../../../lib/constants";
import autocomplete from "../../autocomplete/prefabAutocomplete";
import run from "./prefabEditRun";

export const PrefabEdit: SlashCommandSubcommand = {
  type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
  name: "edit",
  description: "edit a prefab",
  options: [
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "prefab",
      description: "the prefab you'd like to edit",
      required: true,
      autocomplete: true,
      runAutocomplete: autocomplete,
    } as SlashCommandOptionString,
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "character",
      description: "the character you'd like to set the prefab to",
      autocomplete: true,
      runAutocomplete: autocomplete,
    } as SlashCommandOptionString,
    {
      type: CONSTANTS.OPTION_TYPE.ATTACHMENT,
      name: "image",
      description: "the image you'd like to set the prefab to",
    },
    {
      type: CONSTANTS.OPTION_TYPE.INTEGER,
      name: "release",
      description: "the number of the release to put the prefab in",
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
      description: "the new max cards of the prefab",
    },
    {
      type: CONSTANTS.OPTION_TYPE.NUMBER,
      name: "rarity",
      description: "the new relative rarity of the prefab (currently unused)",
    },
  ],
  run,
};
