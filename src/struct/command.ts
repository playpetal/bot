import { AutocompleteInteraction, CommandInteraction } from "eris";
import { PartialUser, SlashCommandOption } from "petal";
import { InteractionOptions } from "./options";
import { optionTypes } from "./options";

export type Run = ({
  interaction,
  user,
  options,
}: {
  interaction: CommandInteraction;
  user: PartialUser;
  options: InteractionOptions;
}) => Promise<unknown> | unknown;
export type Autocomplete = ({
  interaction,
  user,
  options,
}: {
  interaction: AutocompleteInteraction;
  user: PartialUser;
  options: InteractionOptions;
}) => Promise<unknown> | unknown;

export class SlashCommand {
  readonly type = 1;
  readonly name: string;
  description: string;
  options: SlashCommandOption<keyof typeof optionTypes>[] = [];

  private _run: Run | undefined;
  private _autocomplete: Autocomplete | undefined;

  private _modOnly: boolean = false;

  constructor(name: string) {
    this.name = name;
    this.description = "no description";
  }

  public desc(description: string) {
    this.description = description;
    return this;
  }

  public option(option: SlashCommandOption<keyof typeof optionTypes>) {
    this.options.push(option);
    return this;
  }

  public run(run: Run) {
    this._run = run;
    return this;
  }

  public autocomplete(autocomplete: Autocomplete) {
    this._autocomplete = autocomplete;
    return this;
  }

  public getAutocomplete() {
    return this._autocomplete;
  }

  public modOnly(modOnly: boolean) {
    this._modOnly = modOnly;
    return this;
  }

  public async execute({
    interaction,
    user,
    options,
  }: {
    interaction: any;
    user: any;
    options: InteractionOptions;
  }) {
    if (!this._run)
      throw new Error(
        `'this._run' not specified in slash command '${this.name}'`
      );

    return this._run({
      interaction,
      user,
      options,
    });
  }

  public async executeAutocomplete({
    interaction,
    user,
    options,
  }: {
    interaction: AutocompleteInteraction;
    user: PartialUser;
    options: InteractionOptions;
  }) {
    if (!this._autocomplete)
      throw new Error(
        `'this._autocomplete' not specified in slash command '${this.name}'`
      );

    return this._autocomplete({ interaction, user, options });
  }

  public isModOnly() {
    return this._modOnly;
  }
}
