import {
  AutocompleteInteraction,
  CommandInteraction,
  Constants,
  InteractionDataOptionsWithValue,
} from "eris";
import { getSubgroups } from "../../../lib/graphql/query/GET_SUBGROUPS";
import { searchSubgroups } from "../../../lib/graphql/query/SEARCH_SUBGROUPS";
import { SlashCommand } from "../../../struct/command";
import { Embed, ErrorEmbed } from "../../../struct/embed";

async function run(interaction: CommandInteraction) {
  const options = interaction.data.options as InteractionDataOptionsWithValue[];

  const subgroupName = options.find((o) => o.name === "subgroup")!
    .value as string;
  const subgroup = (await getSubgroups({ name: subgroupName }))[0];

  if (!subgroup) {
    return await interaction.createMessage({
      embeds: [
        new ErrorEmbed("i didn't find a subgroup by that name or alias :("),
      ],
      flags: 64,
    });
  }

  const creation = subgroup.creation
    ? new Date(subgroup.creation).toLocaleString("en-us", {
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      })
    : "None";

  const embed = new Embed().setDescription(
    `**Subgroup Info**\nName: **${subgroup.name}**\nCreation: **${creation}**\nID: **${subgroup.id}**`
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
  const subgroups = await searchSubgroups(focused.value);

  const choices = subgroups.map((g) => {
    return { name: g.name, value: g.name };
  });

  await interaction.acknowledge(choices);
}

const command = new SlashCommand(
  "subgroupinfo",
  "gets information about a subgroup",
  run,
  [
    {
      name: "subgroup",
      description: "the subgroup you'd like information about",
      type: Constants.ApplicationCommandOptionTypes.STRING,
      required: true,
      autocomplete: true,
    },
  ],
  runAutocomplete
);

export default command;
