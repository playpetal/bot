import { slashCommand } from "../../../../lib/command";
import { SongsCreate } from "./subcommands/create/songsCreate";

export default slashCommand("songs").option(SongsCreate).modOnly(true);
