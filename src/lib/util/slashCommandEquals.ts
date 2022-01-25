import { ApplicationCommand } from "eris";
import { SlashCommand } from "../../struct/command";
import equal from "fast-deep-equal";

type Command = SlashCommand | ApplicationCommand;

export function slashCommandEquals(a: Command, b: Command): boolean {
  if (a.name !== b.name) return false;
  if (a.description !== b.description) return false;
  if (!a.options && !b.options) return true;

  if (a.options?.length !== b.options?.length) return false;

  return equal(a.options, b.options);
}
