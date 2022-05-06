import { slashCommand } from "../../../../lib/command";
import { QuestionCreate } from "./subcommands/create/questionCreate";

export default slashCommand("question").option(QuestionCreate).modOnly(true);
