import { CommandInteraction, ComponentInteraction } from "eris";
import { PartialUser } from "petal";
import { logger } from "..";
import { SlashCommand } from "../../../struct/command";
import { Component } from "../../../struct/component";

export function logCommandError(
  interaction: CommandInteraction,
  user: PartialUser | null,
  command: SlashCommand,
  error: unknown
): void {
  logger.error({
    command: command.name,
    options: interaction.data.options,
    invoker: user ? user.id : null,
    error: {
      name: isError(error) ? error.name : "Unknown",
      message: isError(error) ? error.message : "Unknown",
      stack: isError(error) ? error.stack || "Unknown" : "Unknown",
    },
  });
}

export function logComponentError(
  interaction: ComponentInteraction,
  user: PartialUser | null,
  component: Component,
  error: unknown
): void {
  logger.error({
    component: component.customId,
    parameters: interaction.data.custom_id.split("?")[1],
    invoker: user ? user.id : null,
    error: {
      name: isError(error) ? error.name : "Unknown",
      message: isError(error) ? error.message : "Unknown",
      stack: isError(error) ? error.stack || "Unknown" : "Unknown",
    },
  });
}

function isError(error: any): error is Error {
  return error.message !== undefined && error.name !== undefined;
}
