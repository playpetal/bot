import { slashCommand } from "../../../../lib/command";
import { ShopBuy } from "./subcommands/buy/shopBuy";
import { ShopView } from "./subcommands/view/shopView";

export default slashCommand("shop")
  .desc("support petal!")
  .option(ShopView)
  .option(ShopBuy);
