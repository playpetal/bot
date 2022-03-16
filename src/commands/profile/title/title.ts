import { slashCommand } from "../../../lib/command";
import { TitleInventory } from "./subcommands/inventory/titleInventory";
import { TitleUse } from "./subcommands/use/titleUse";
import { TitleView } from "./subcommands/view/titleView";

export default slashCommand("title")
  .desc("shows info about a title")
  .option(TitleView)
  .option(TitleInventory)
  .option(TitleUse);
