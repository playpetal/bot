import {
  AutocompleteInteraction,
  CommandInteraction,
  ComponentInteraction,
} from "eris";
import { bot } from "..";
import { getUserPartial } from "../lib/graphql/query/GET_USER_PARTIAL";
import { Embed, ErrorEmbed } from "../struct/embed";
import { Event } from "../struct/event";
import { InteractionOption, Maybe, PartialUser } from "petal";
import { InteractionOptions } from "../struct/options";
import { BotError } from "../struct/error";

const run = async function (interaction: unknown) {
  if (
    !(interaction instanceof CommandInteraction) &&
    !(interaction instanceof AutocompleteInteraction) &&
    !(interaction instanceof ComponentInteraction)
  )
    return;

  if (
    !(interaction instanceof AutocompleteInteraction) &&
    !interaction.guildID
  ) {
    await interaction.createMessage({
      flags: 64,
      embeds: [
        new ErrorEmbed(
          "sorry, but you can only use petal in servers for now. :("
        ),
      ],
    });

    return;
  }

  if (interaction instanceof ComponentInteraction) {
    const component = bot.components.find(
      (c) => c.customId === interaction.data.custom_id.split("?")[0]
    );
    if (!component) return;

    await interaction.acknowledge();
    if (!interaction.member) return;

    const user = await getUserPartial(interaction.member.id);

    if (!user) return;

    try {
      return await component.run(interaction, user);
    } catch (e) {
      if (e instanceof BotError) {
        return interaction.createMessage({
          embeds: [new ErrorEmbed(e.message)],
          flags: 64,
        });
      } else {
        console.log(e);
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

  const command = bot.commands.find((c) => c.name === interaction.data.name);
  if (!command) return;

  if (interaction instanceof CommandInteraction)
    await interaction.acknowledge();

  if (!interaction.member) return;

  let user: Maybe<PartialUser>;

  try {
    user = await getUserPartial(interaction.member.id);
  } catch (e) {
    if (!(interaction instanceof AutocompleteInteraction)) {
      return interaction.createMessage({
        embeds: [
          new ErrorEmbed(
            "failed to connect to the api... try again in a few minutes? 😕"
          ),
        ],
      });
    }
    return interaction.acknowledge([
      {
        name: "could not connect to the api to fetch options :(",
        value: "ERROR",
      },
    ]);
  }

  try {
    if (!user) {
      if (!(interaction instanceof CommandInteraction)) return;
      if (command.name === "register") {
        // TODO: fix this hack
        await command.execute({
          interaction,
          user: {
            id: 0,
            username: "",
            title: { title: { title: "" } },
          },
          options: new InteractionOptions(
            interaction.data.options as InteractionOption<boolean>[]
          ),
        });
        return;
      }

      throw new BotError(
        "please sign up by using **/register `username`** to play petal!"
      );
    }

    if (interaction instanceof CommandInteraction) {
      const options = new InteractionOptions(
        interaction.data.options as InteractionOption<boolean>[]
      );

      await command.execute({ interaction, user, options });
    } else {
      const options = new InteractionOptions(
        interaction.data.options as InteractionOption<boolean>[]
      );

      if (command.getAutocomplete())
        await command.executeAutocomplete({ interaction, user, options });
    }
  } catch (e) {
    if (interaction instanceof CommandInteraction) {
      if (e instanceof BotError) {
        return interaction.createMessage({
          embeds: [new ErrorEmbed(e.message)],
        });
      } else {
        console.log(e);
        return interaction.createMessage({
          embeds: [
            new ErrorEmbed(
              "**an unexpected error occurred.**\nplease try again in a few moments."
            ),
          ],
        });
      }
    } else
      return interaction.acknowledge([
        { name: "an error occurred :(", value: "-1" },
      ]);
  }
};

export default new Event(["interactionCreate"], run);
