import { slashCommand } from "../../../lib/command";
import { BiasAdd } from "./subcommands/add/biasAdd";
import { BiasRemove } from "./subcommands/remove/biasRemove";

export default slashCommand("bias")
  .desc("bias")
  .option(BiasAdd)
  .option(BiasRemove);
