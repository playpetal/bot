import { slashCommand } from "../../../../lib/command";
import { PrefabCreate } from "./subcommands/create/prefabCreate";
import { PrefabEdit } from "./subcommands/edit/prefabEdit";

export default slashCommand("prefab")
  .option(PrefabCreate)
  .option(PrefabEdit)
  .modOnly(true);
