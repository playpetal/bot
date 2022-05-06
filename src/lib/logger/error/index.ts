import {
  CommandInteraction,
  ComponentInteraction,
  ModalSubmitInteraction,
} from "eris";
import { PartialUser } from "petal";
import { logger } from "..";
import { SlashCommand } from "../../../struct/command";
import { Component } from "../../../struct/component";
import { Modal } from "../../../struct/modal";
import { dd } from "../../statsd";

export function logCommandError(
  interaction: CommandInteraction,
  user: PartialUser | null,
  command: SlashCommand,
  error: unknown
): void {
  dd.increment(`petal.error.command`);

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
  interaction: ComponentInteraction | ModalSubmitInteraction,
  user: PartialUser | null,
  component: Component | Modal,
  error: unknown
): void {
  dd.increment(`petal.error.component`);
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
