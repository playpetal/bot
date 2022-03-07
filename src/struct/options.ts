import { InteractionOption } from "petal";
import { CONSTANTS } from "../lib/constants";

export class InteractionOptions {
  options: InteractionOption[] = [];

  public _getOption<T>(name: string): T | undefined {
    return this.options.find((o) => o.name === name)?.value as T | undefined;
  }

  // shawty rewrite this please
  public getFocused(): InteractionOption | undefined {
    for (let opt of this.options) {
      if (opt.focused) return { ...opt, focused: true } as InteractionOption;
      if (opt.options) {
        for (let _opt of opt.options) {
          if (_opt.focused)
            return { ...opt, focused: true } as InteractionOption;
          if (_opt.options) {
            for (let __opt of _opt.options) {
              if (__opt.focused)
                return { ...opt, focused: true } as InteractionOption;
            }
          }
        }
      }
    }
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
