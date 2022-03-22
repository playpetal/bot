import { slashCommand } from "../../../../lib/command";
import { TagCreate } from "./subcommands/create/tagCreate";
import { TagDelete } from "./subcommands/delete/tagDelete";

export default slashCommand("tag").option(TagCreate).option(TagDelete);
