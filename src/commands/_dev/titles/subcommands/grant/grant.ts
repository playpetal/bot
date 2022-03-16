import { SlashCommandSubcommandGroup } from "petal";
import { CONSTANTS } from "../../../../../lib/constants";
import { TitlesGrantAll } from "./subcommands/all/titlesGrantAll";
import { TitlesGrantUser } from "./subcommands/user/titlesGrantUser";

export const TitlesGrant: SlashCommandSubcommandGroup = {
  type: CONSTANTS.OPTION_TYPE.SUBCOMMAND_GROUP,
  name: "grant",
  description: "grants a title to users",
  options: [TitlesGrantAll, TitlesGrantUser],
};
