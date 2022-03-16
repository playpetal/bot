import { slashCommand } from "../../../../lib/command";
import { CardBurn } from "./subcommands/burn/cardBurn";
import { CardDye } from "./subcommands/dye/cardDye";
import { CardView } from "./subcommands/view/cardView";

export default slashCommand("card")
  .option(CardView)
  .option(CardBurn)
  .option(CardDye);
