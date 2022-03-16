import { SlashCommandSubcommandGroup } from "petal";
import { CONSTANTS } from "../../../../../lib/constants";
import { TitlesRevokeAll } from "./subcommands/all/titlesRevokeAll";
import { TitlesRevokeUser } from "./subcommands/user/titlesRevokeUser";

export const TitlesRevoke: SlashCommandSubcommandGroup = {
  type: CONSTANTS.OPTION_TYPE.SUBCOMMAND_GROUP,
  name: "revoke",
  description: "revokes a title from users",
  options: [TitlesRevokeAll, TitlesRevokeUser],
};
