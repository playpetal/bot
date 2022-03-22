import { SlashCommandOptionString, SlashCommandSubcommand } from "petal";
import { CONSTANTS } from "../../../../../../lib/constants";
import { tagAutocomplete } from "../../autocomplete/tagAutocomplete";
import tagDeleteRun from "./tagDeleteRun";

export const TagDelete: SlashCommandSubcommand = {
  type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
  name: "delete",
  description: "deletes a tag. this will also untag all cards with this tag.",
  options: [
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "tag",
      description: "the name of the tag you want to delete",
      required: true,
      autocomplete: true,
      runAutocomplete: tagAutocomplete,
    } as SlashCommandOptionString,
  ],
  run: tagDeleteRun,
};
