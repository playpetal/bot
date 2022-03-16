import { SlashCommandOptionString, SlashCommandSubcommand } from "petal";
import { CONSTANTS } from "../../../../../../lib/constants";
import run from "./songsCreateRun";
import { default as groupAutocomplete } from "../../autocomplete/songsGroupAutocomplete";
import { default as soloistAutocomplete } from "../../autocomplete/songsGroupAutocomplete";

export const SongsCreate: SlashCommandSubcommand = {
  type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
  name: "create",
  description: "create a new song",
  options: [
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "url",
      description: "the url to the video to rip the audio from",
      required: true,
    },
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "title",
      description: "the title of the song",
      required: true,
    },
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "group",
      description: "the group the song is made by (optional)",
      autocomplete: true,
      runAutocomplete: groupAutocomplete,
    } as SlashCommandOptionString,
    {
      type: CONSTANTS.OPTION_TYPE.STRING,
      name: "soloist",
      description: "the soloist the song is made by (optional)",
      autocomplete: true,
      runAutocomplete: soloistAutocomplete,
    } as SlashCommandOptionString,
    {
      type: CONSTANTS.OPTION_TYPE.NUMBER,
      name: "release",
      description:
        "the release the song is bound to (will be auto-set to latest undroppable release)",
    },
  ],
  run,
};
