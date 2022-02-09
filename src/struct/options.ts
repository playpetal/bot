import { InteractionOption } from "petal";

export class InteractionOptions {
  options: InteractionOption<boolean>[] = [];

  public getOption<T>(name: string): T | undefined {
    return this.options.find((o) => o.name === name)?.value as T | undefined;
  }

  // shawty rewrite this please
  public getFocused(): InteractionOption<true> | undefined {
    for (let opt of this.options) {
      if (opt.focused)
        return { ...opt, focused: true } as InteractionOption<true>;
      if (opt.options) {
        for (let _opt of opt.options) {
          if (_opt.focused)
            return { ...opt, focused: true } as InteractionOption<true>;
          if (_opt.options) {
            for (let __opt of _opt.options) {
              if (__opt.focused)
                return { ...opt, focused: true } as InteractionOption<true>;
            }
          }
        }
      }
    }
  }

  constructor(options: InteractionOption<boolean>[] | undefined) {
    this.options = options || [];
  }
}

export const optionTypes = {
  subcommand: 1,
  subcommandGroup: 2,
  string: 3,
  integer: 4,
  boolean: 5,
  user: 6,
  channel: 7,
  role: 8,
  mentionable: 9,
  number: 10,
  attachment: 11,
} as const;
