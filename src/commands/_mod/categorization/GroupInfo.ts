import {
  AutocompleteInteraction,
  CommandInteraction,
  Constants,
  InteractionDataOptionsWithValue,
} from "eris";
import { getGroups } from "../../../lib/graphql/query/GET_GROUPS";
import { searchGroups } from "../../../lib/graphql/query/SEARCH_GROUPS";
import { SlashCommand } from "../../../struct/command";
import { Embed, ErrorEmbed } from "../../../struct/embed";

async function run(interaction: CommandInteraction) {
  const options = interaction.data.options as InteractionDataOptionsWithValue[];

  const groupName = options.find((o) => o.name === "group")!.value as string;
  const group = (await getGroups({ name: groupName }))[0];

  if (!group) {
    return await interaction.createMessage({
      embeds: [
        new ErrorEmbed("i didn't find a group by that name or alias :("),
      ],
      flags: 64,
    });
  }

  const embed = new Embed().setDescription(
    `**Group Info**\nName: **${group.name}**\nCreation: **${
      group.creation || "None"
    }**\nGender: **${group.gender || "None"}**\nAliases: **${
      group.aliases.length > 0
        ? group.aliases.map((a) => a.alias).join(", ")
        : ""
    }**\nID: ${group.id}`
  );

  await interaction.createMessage({ embeds: [embed] });
}

async function runAutocomplete(interaction: AutocompleteInteraction) {
  const options = interaction.data.options as {
    value: string;
    type: 3;
    name: string;
    focused?: boolean;
  }[];

  const focused = options.find((o) => o.focused)!;
  const groups = await searchGroups(focused.value);

  const choices = groups.map((g) => {
    return { name: g.name, value: g.name };
  });

  await interaction.acknowledge(choices);
}

const command = new SlashCommand(
  "groupinfo",
  "gets information about a group",
  run,
  [
    {
      name: "group",
      description: "the group you'd like information about",
      type: Constants.ApplicationCommandOptionTypes.STRING,
      required: true,
      autocomplete: true,
    },
  ],
  runAutocomplete
);

export default command;
