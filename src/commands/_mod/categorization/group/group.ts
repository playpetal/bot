import { slashCommand } from "../../../../lib/command";
import { GroupCreate } from "./subcommands/create/groupCreate";
import { GroupEdit } from "./subcommands/edit/groupEdit";
import { GroupInfo } from "./subcommands/info/groupInfo";

export default slashCommand("group")
  .option(GroupCreate)
  .option(GroupEdit)
  .option(GroupInfo)
  .modOnly(true);
