import { slashCommand } from "../../../../lib/command";
import { TagCreate } from "./subcommands/create/tagCreate";

export default slashCommand("tag").option(TagCreate);
