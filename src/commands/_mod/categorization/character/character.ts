import { slashCommand } from "../../../../lib/command";
import { CharacterCreate } from "./subcommands/create/characterCreate";
import { CharacterEdit } from "./subcommands/edit/characterEdit";
import { CharacterInfo } from "./subcommands/info/characterInfo";

export default slashCommand("character")
  .option(CharacterCreate)
  .option(CharacterInfo)
  .option(CharacterEdit)
  .modOnly(true);
