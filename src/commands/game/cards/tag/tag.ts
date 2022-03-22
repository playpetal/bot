import { slashCommand } from "../../../../lib/command";
import { TagCreate } from "./subcommands/create/tagCreate";
import { TagDelete } from "./subcommands/delete/tagDelete";
import { TagEdit } from "./subcommands/edit/tagEdit";

export default slashCommand("tag")
  .option(TagCreate)
  .option(TagDelete)
  .option(TagEdit);
