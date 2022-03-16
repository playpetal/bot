import { slashCommand } from "../../../../lib/command";
import { ReleaseCreate } from "./subcommands/create/releaseCreate";
import { ReleaseEdit } from "./subcommands/edit/releaseEdit";

export default slashCommand("release")
  .option(ReleaseCreate)
  .option(ReleaseEdit)
  .modOnly(true);
