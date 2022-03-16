import { AutocompleteInteraction, CommandInteraction } from "eris";
import {
  AnySlashCommandOption,
  PartialUser,
  Run,
  SlashCommandOptionNumeric,
  SlashCommandOptionString,
  SlashCommandSubcommand,
  SlashCommandSubcommandGroup,
} from "petal";
import { InteractionOptions } from "./options";

export class SlashCommand {
  readonly type = 1;
  readonly name: string;
  description: string;
  options: AnySlashCommandOption[] = [];
  isEphemeral: boolean = false;

  private _run: Run | undefined;

  private _modOnly: boolean = false;

  constructor(name: string) {
    this.name = name;
    this.description = "no description";
  }

  public desc(description: string) {
    this.description = description;
    return this;
  }

  public option(option: AnySlashCommandOption) {
    this.options.push(option);
    return this;
  }

  public run(run: Run) {
    this._run = run;
    return this;
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
    interaction: CommandInteraction;
    user: PartialUser;
    options: InteractionOptions;
  }) {
    const subcommandGroup = options.getSubcommandGroup();
    const subcommand = options.getSubcommand();

    if (subcommandGroup) {
      const targetGroup = this.options.find(
        (g) => g.name === subcommandGroup.name
      )! as SlashCommandSubcommandGroup;

      const targetSubcommand = targetGroup.options!.find(
        (s) => s.name === subcommand!.name
      )!;

      await targetSubcommand.run!({ interaction, user, options });
      return;
    }

    if (subcommand) {
      const target = this.options.find(
        (s) => s.name === subcommand.name
      ) as SlashCommandSubcommand;

      await target.run!({ interaction, user, options });
      return;
    }

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
    const focused = options.getFocused()!;

    const group = options.getSubcommandGroup();
    const subcommand = options.getSubcommand();

    if (group) {
      const targetGroup = this.options.find(
        (g) => g.name === group.name
      )! as SlashCommandSubcommandGroup;

      const targetSubcommand = targetGroup.options!.find(
        (s) => s.name === subcommand!.name
      )! as SlashCommandSubcommand;

      const targetOption = targetSubcommand.options!.find(
        (o) => o.name === focused.name
      )! as SlashCommandOptionString | SlashCommandOptionNumeric;

      await targetOption.runAutocomplete!({ interaction, user, options });
      return;
    }

    if (subcommand) {
      const target = this.options.find(
        (s) => s.name === subcommand.name
      ) as SlashCommandSubcommand;

      const option = target.options?.find((o) => o.name === focused.name) as
        | SlashCommandOptionString
        | SlashCommandOptionNumeric;

      await option.runAutocomplete!({ interaction, user, options });
    } else {
      const option = this.options.find((o) => o.name === focused.name) as
        | SlashCommandOptionString
        | SlashCommandOptionNumeric;

      await option.runAutocomplete!({ interaction, user, options });
    }

    return;
  }

  public isModOnly() {
    return this._modOnly;
  }

  public ephemeral() {
    this.isEphemeral = true;
    return this;
  }
}
