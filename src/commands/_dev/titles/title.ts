import { slashCommand } from "../../../lib/command";
import { TitlesCreate } from "./subcommands/create/titlesCreate";
import { TitlesGrant } from "./subcommands/grant/grant";
import { TitlesRevoke } from "./subcommands/revoke/revoke";

export default slashCommand("titles")
  .option(TitlesCreate)
  .option(TitlesGrant)
  .option(TitlesRevoke)
  .modOnly(true);
