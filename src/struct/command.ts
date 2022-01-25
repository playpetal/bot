import {
  ApplicationCommandOptions,
  AutocompleteInteraction,
  ChatInputApplicationCommandStructure,
  CommandInteraction,
  Constants,
} from "eris";

type RunSlashCommand = (
  interaction: CommandInteraction,
  user: { id: number; username: string; title: { title: { title: string } } }
) => Promise<unknown> | unknown;
type RunAutocomplete = (
  interaction: AutocompleteInteraction,
  user: { id: number; username: string; title: { title: { title: string } } }
) => Promise<unknown> | unknown;

export class SlashCommand implements ChatInputApplicationCommandStructure {
  name: string;
  description: string;
  type = Constants.ApplicationCommandTypes.CHAT_INPUT;
  modOnly = false;

  options: ApplicationCommandOptions[] | undefined;

  run: RunSlashCommand;
  runAutocomplete?: RunAutocomplete;

  constructor(
    name: string,
    description: string,
    run: RunSlashCommand,
    options?: ApplicationCommandOptions[],
    runAutocomplete?: RunAutocomplete
  ) {
    this.name = name;
    this.description = description;

    this.options = options;

    this.run = run;
    this.runAutocomplete = runAutocomplete;
  }
}
