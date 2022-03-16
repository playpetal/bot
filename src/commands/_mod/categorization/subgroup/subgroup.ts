import { slashCommand } from "../../../../lib/command";
import { SubgroupCreate } from "./subcommands/create/subgroupCreate";
import { SubgroupEdit } from "./subcommands/edit/subgroupEdit";
import { SubgroupInfo } from "./subcommands/info/subgroupInfo";

export default slashCommand("subgroup")
  .option(SubgroupCreate)
  .option(SubgroupEdit)
  .option(SubgroupInfo)
  .modOnly(true);
