import {
  AutocompleteInteraction,
  CommandInteraction,
  ComponentInteraction,
} from "eris";
import { bot } from "..";
import { getUserPartial } from "../lib/graphql/query/GET_USER_PARTIAL";
import { ErrorEmbed } from "../struct/embed";
import { Event } from "../struct/event";
import { CommandInteraction as CInt, InteractionOption } from "petal";
import { InteractionOptions } from "../struct/options";

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

    return await component.run(interaction, user);
  }

  const command = bot.commands.find((c) => c.name === interaction.data.name);
  if (!command) return;

  if (interaction instanceof CommandInteraction)
    await interaction.acknowledge();

  if (!interaction.member) return;

  const user = await getUserPartial(interaction.member.id);

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

    const embed = new ErrorEmbed(
      "please sign up by using **/register `username`** to play petal!"
    );
    return await interaction.createMessage({
      embeds: [embed],
    });
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
};

export default new Event(["interactionCreate"], run);
