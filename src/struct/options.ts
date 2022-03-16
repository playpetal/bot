import { InteractionOption } from "petal";
import { CONSTANTS } from "../lib/constants";

export class InteractionOptions {
  options: InteractionOption[] = [];

  public _getOption<T>(name: string): T | undefined {
    return this.options.find((o) => o.name === name)?.value as T | undefined;
  }

  public getFocused(): InteractionOption | undefined {
    let options = this.options;

    if (this.options[0]?.type === CONSTANTS.OPTION_TYPE.SUBCOMMAND) {
      options = this.options[0].options!;
    } else if (
      this.options[0]?.type === CONSTANTS.OPTION_TYPE.SUBCOMMAND_GROUP
    ) {
      options = this.options[0].options![0].options!;
    }

    return options.find((o) => o.focused);
  }

  public getSubcommandGroup(): InteractionOption | undefined {
    const option = this.options[0];
    if (option?.type === CONSTANTS.OPTION_TYPE.SUBCOMMAND_GROUP) return option;
  }

  public getSubcommand(): InteractionOption | undefined {
    const option = this.options[0];
    if (option?.type === CONSTANTS.OPTION_TYPE.SUBCOMMAND) return option;
    if (option?.type === CONSTANTS.OPTION_TYPE.SUBCOMMAND_GROUP)
      if (option.options) return option.options[0];
  }

  public getOption<T extends string | number | boolean>(
    option: string
  ): T | undefined {
    const root = this.options[0];
    if (!root) return;

    if (root.type === CONSTANTS.OPTION_TYPE.SUBCOMMAND) {
      return root.options!.find((o) => o.name === option)?.value as
        | T
        | undefined;
    } else if (root.type === CONSTANTS.OPTION_TYPE.SUBCOMMAND_GROUP) {
      const subcommand = root.options![0];

      return subcommand.options!.find((o) => o.name === option)?.value as
        | T
        | undefined;
    }

    return this.options.find((o) => o.name === option)?.value as T | undefined;
  }

  constructor(options: InteractionOption[] | undefined) {
    this.options = options || [];
  }
}
