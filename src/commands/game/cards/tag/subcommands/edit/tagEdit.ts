import { SlashCommandOptionString, SlashCommandSubcommand } from "petal";
import { CONSTANTS } from "../../../../../../lib/constants";
import { tagAutocomplete } from "../../autocomplete/tagAutocomplete";
import { tagEditRun } from "./tagEditRun";

export const TagEdit: SlashCommandSubcommand = {
  type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
  name: "edit",
  description: "change a tag's name or emoji",
  options: [
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "tag",
      description: "the name of the tag you want to edit",
      required: true,
      autocomplete: true,
      runAutocomplete: tagAutocomplete,
    } as SlashCommandOptionString,
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "name",
      description: "the tag's new name",
    },
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "emoji",
      description: "the tag's new emoji",
    },
  ],
  run: tagEditRun,
};
