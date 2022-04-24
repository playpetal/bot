import { ApplicationCommand } from "eris";
import { SlashCommand } from "../../struct/command";
import equal from "fast-deep-equal";
import {
  AnySlashCommandOption,
  SlashCommandOption,
  SlashCommandOptionNumeric,
  SlashCommandOptionString,
  SlashCommandSubcommand,
} from "petal";
import { isSubcommand, isSubcommandGroup } from "../command";

type Command = SlashCommand | ApplicationCommand;

export function slashCommandEquals(a: Command, b: Command): boolean {
  if (a.type !== b.type) return false;
  if (a.name !== b.name) return false;
  if (a.description !== b.description) return false;

  let optA = [];
  let optB = [];
  if (a instanceof SlashCommand) {
    optA = parseOptions(a.options);
  } else optA = a.options || [];

  if (b instanceof SlashCommand) {
    optB = parseOptions(b.options);
  } else optB = b.options || [];

  if (!optA && !optB) return true;
  if (optA.length !== optB.length) return false;

  return equal(optA, optB);
}

function parseOptions(
  options: AnySlashCommandOption[]
): AnySlashCommandOption[] {
  const parsed: AnySlashCommandOption[] = [];

  for (let opt of options) {
    const _opt = { ...opt } as AnySlashCommandOption;

    if (isSubcommand(_opt)) {
      if (_opt.options) {
        _opt.options = parseOptions(_opt.options) as SlashCommandOption[];
      }
    } else if (isSubcommandGroup(_opt)) {
      _opt.options = parseOptions(_opt.options!) as SlashCommandSubcommand[];
    }

    if (isSubcommand(_opt)) {
      delete _opt.ephemeral;
      delete _opt.run;
    } else if (isAutocompletable(_opt)) {
      delete _opt.runAutocomplete;
    }

    parsed.push(_opt);
  }

  return parsed;
}

function isAutocompletable(
  option: AnySlashCommandOption
): option is SlashCommandOptionNumeric | SlashCommandOptionString {
  return option.type === 3 || option.type === 4 || option.type === 10;
}
