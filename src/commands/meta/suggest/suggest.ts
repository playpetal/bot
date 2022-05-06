import { slashCommand } from "../../../lib/command";
import { SuggestCards } from "./subcommands/cards/suggestCards";

export default slashCommand("suggest")
  .desc("suggest")
  .option(SuggestCards)
  .mainOnly(true);
