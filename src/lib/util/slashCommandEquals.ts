import { ApplicationCommand } from "eris";
import { SlashCommand } from "../../struct/command";
import equal from "fast-deep-equal";
import { parseOptions } from "../command";

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
