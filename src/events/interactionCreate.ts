import {
  AutocompleteInteraction,
  CommandInteraction,
  ComponentInteraction,
} from "eris";
import { bot } from "..";
import { getUserPartial } from "../lib/graphql/query/GET_USER_PARTIAL";
import { ErrorEmbed } from "../struct/embed";
import { Event } from "../struct/event";

const run = async function (interaction: unknown) {
  if (
    !(interaction instanceof CommandInteraction) &&
    !(interaction instanceof AutocompleteInteraction) &&
    !(interaction instanceof ComponentInteraction)
  )
    return;

  if (interaction instanceof ComponentInteraction) {
    const component = bot.components.find(
      (c) => c.customId === interaction.data.custom_id
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
      await command.run(interaction, {
        id: 0,
        username: "",
        title: { title: { title: "" } },
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
    await command.run(interaction, user);
  } else {
    if (command.runAutocomplete)
      await command.runAutocomplete(interaction, user);
  }
};

export default new Event(["interactionCreate"], run);
