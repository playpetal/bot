import {
  AutocompleteInteraction,
  CommandInteraction,
  ComponentInteraction,
  ModalSubmitInteraction,
  UnknownInteraction,
} from "eris";
import { bot } from "..";
import { getUserPartial } from "../lib/graphql/query/GET_USER_PARTIAL";
import { ErrorEmbed } from "../struct/embed";
import { Event } from "../struct/event";
import {
  InteractionOption,
  Maybe,
  PartialUser,
  SlashCommandOption,
} from "petal";
import { InteractionOptions } from "../struct/options";
import { BotError } from "../struct/error";
import { logger } from "../lib/logger";
import { logCommandError, logComponentError } from "../lib/logger/error";

const run = async function (interaction: UnknownInteraction) {
  if (!interaction.member) {
    return interaction.createMessage({
      embeds: [
        new ErrorEmbed(
          "sorry, but you can only use petal in servers for now. :("
        ),
      ],
      flags: 64,
    });
  }

  let user: Maybe<PartialUser>;

  try {
    user = await getUserPartial({ discordId: interaction.member.id });
  } catch (e) {
    logger.error(e);

    if (interaction instanceof AutocompleteInteraction)
      return interaction.acknowledge([]);

    return interaction.createMessage({
      embeds: [
        new ErrorEmbed(
          "failed to connect to the api... try again in a few minutes? 😕"
        ),
      ],
      flags: 64,
    });
  }

  /* Slash Commands */
  if (interaction instanceof CommandInteraction) {
    const command = bot.findCommand(interaction.data.name);
    if (!command) return;

    try {
      let acknowledged = false;
      const isSubcommand =
        interaction.data.options && interaction.data.options[0].type === 1;

      if (isSubcommand) {
        const subcommand = command.options.find(
          (o) =>
            o.type === "subcommand" &&
            o.name === interaction.data.options![0].name
        ) as SlashCommandOption<"subcommand">;

        if (subcommand && subcommand.ephemeral) {
          await interaction.acknowledge(64);
          acknowledged = true;
        }
      }

      if (!acknowledged)
        await interaction.acknowledge(command.isEphemeral ? 64 : undefined);

      if (!user && command.name === "register") {
        return await command.execute({
          interaction,
          user: {
            id: -1,
            discordId: interaction.member.id,
            username: "",
            title: null,
          },
          options: new InteractionOptions(
            interaction.data.options as InteractionOption<boolean>[]
          ),
        });
      } else if (!user) {
        throw new BotError(
          "please sign up by using **/register `username`** to play petal!"
        );
      }

      const options = new InteractionOptions(
        interaction.data.options as InteractionOption<boolean>[]
      );

      await command.execute({ interaction, user, options });
      return;
    } catch (e) {
      if (e instanceof BotError) {
        return interaction.createMessage({
          embeds: [new ErrorEmbed(e.message)],
          components: e.components,
          flags: 64,
        });
      } else {
        logCommandError(interaction, user, command, e);
      }

      return interaction.createMessage({
        embeds: [
          new ErrorEmbed(
            "**an unexpected error occurred.**\nplease try again in a few moments."
          ),
        ],
        flags: 64,
      });
    }
  }

  /* Autocompletes */
  if (interaction instanceof AutocompleteInteraction) {
    try {
      const command = bot.findCommand(interaction.data.name);
      if (!command) return;

      if (!user) return interaction.acknowledge([]);

      const options = new InteractionOptions(
        interaction.data.options as InteractionOption<boolean>[]
      );

      if (command.getAutocomplete())
        await command.executeAutocomplete({ interaction, user, options });
    } catch (e) {
      logger.error(e);

      return interaction.acknowledge([
        { name: "an error occurred :(", value: "-1" },
      ]);
    }
  }

  /* Components */
  if (interaction instanceof ComponentInteraction) {
    const component = bot.findComponent(interaction.data.custom_id);
    if (!component) return;

    try {
      if (component.autoAck) await interaction.acknowledge();
      if (!interaction.member) return;

      if (!user) return;

      return await component.execute({ interaction, user });
    } catch (e) {
      if (e instanceof BotError) {
        return interaction.createMessage({
          embeds: [new ErrorEmbed(e.message)],
          components: e.components,
          flags: 64,
        });
      } else {
        logComponentError(interaction, user, component, e);

        return interaction.createMessage({
          embeds: [
            new ErrorEmbed(
              "**an unexpected error occurred.**\nplease try again in a few moments."
            ),
          ],
          flags: 64,
        });
      }
    }
  }

  /* Modals */
  if (interaction instanceof ModalSubmitInteraction) {
    const modal = bot.findModal(interaction.data.custom_id);
    if (!modal) return;

    modal.execute({ interaction, user });
    return;
  }
};

export default new Event(["interactionCreate"], run);
