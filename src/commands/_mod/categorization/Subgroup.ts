import { InteractionOption, SlashCommandOption } from "petal";
import { createSubgroup } from "../../../lib/graphql/mutation/CREATE_SUBGROUP";
import { updateSubgroup } from "../../../lib/graphql/mutation/UPDATE_SUBGROUP";
import { getSubgroup } from "../../../lib/graphql/query/GET_SUBGROUP";
import { searchSubgroups } from "../../../lib/graphql/query/SEARCH_SUBGROUPS";
import { Autocomplete, Run, SlashCommand } from "../../../struct/command";
import { Embed, ErrorEmbed } from "../../../struct/embed";

const run: Run = async ({ interaction, user, options }) => {
  const subcommand = options.options[0] as InteractionOption<boolean>;

  if (subcommand.name === "info") {
    const strSubgroupId = subcommand.options![0].value as string;
    const subgroupId = parseInt(strSubgroupId, 10);

    if (isNaN(subgroupId)) {
      return await interaction.createMessage({
        embeds: [new ErrorEmbed("please select a subgroup from the dropdown!")],
      });
    }

    const subgroup = await getSubgroup(subgroupId);

    if (!subgroup) {
      return await interaction.createMessage({
        embeds: [new ErrorEmbed("please select a subgroup from the dropdown!")],
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

    return interaction.createMessage({ embeds: [embed] });
  }

  const name = subcommand.options!.find((o) => o.name === "name")!
    .value as string;
  const creation = subcommand.options!.find((o) => o.name === "creation")
    ?.value as string | undefined;

  if (subcommand.name === "create") {
    const subgroup = await createSubgroup(
      user.discordId,
      name,
      creation ? new Date(creation) : undefined
    );

    const embed = new Embed().setDescription(
      `the subgroup **${subgroup.name}** has been created!`
    );

    return interaction.createMessage({ embeds: [embed] });
  } else if (subcommand.name === "edit") {
    const strSubgroupId = subcommand.options![0].value as string;
    const subgroupId = parseInt(strSubgroupId, 10);

    if (isNaN(subgroupId)) {
      return await interaction.createMessage({
        embeds: [new ErrorEmbed("please select a subgroup from the dropdown!")],
      });
    }

    const subgroup = await getSubgroup(subgroupId);

    if (!subgroup) {
      return await interaction.createMessage({
        embeds: [new ErrorEmbed("please select a subgroup from the dropdown!")],
      });
    }

    if (!name && creation === undefined) {
      return await interaction.createMessage({
        embeds: [
          new ErrorEmbed("you didn't change anything about the subgroup."),
        ],
        flags: 64,
      });
    }

    const newSubgroup = await updateSubgroup(
      user.discordId,
      subgroup.id,
      name,
      creation ? new Date(creation) : undefined
    );

    return interaction.createMessage({
      embeds: [
        new Embed().setDescription(
          `the subgroup **${newSubgroup.name}** has been updated!\ncheck **/subgroup info \`${newSubgroup.name}\`** to see the new info!`
        ),
      ],
    });
  }
};

const autocomplete: Autocomplete = async ({ interaction, options }) => {
  const focused = options.getFocused()!;
  let choices: { name: string; value: string }[] = [];
  const nested = focused.options!.find((o) => o.focused)!;

  if (nested.name === "subgroup") {
    const subgroups = await searchSubgroups(nested.value as string);

    choices = subgroups.map((s) => {
      const creation = s.creation
        ? new Date(s.creation).toISOString().split("T")[0]
        : "No Date";
      return { name: `${s.name} (${creation})`, value: s.id.toString() };
    });
  }

  return interaction.acknowledge(choices);
};

export default new SlashCommand("subgroup")
  .run(run)
  .autocomplete(autocomplete)
  .option({
    type: "subcommand",
    name: "info",
    description: "view information about a subgroup",
    options: [
      {
        type: "string",
        name: "subgroup",
        description: "the subgroup you'd like to view",
        required: true,
        autocomplete: true,
      } as SlashCommandOption<"string">,
    ],
  } as SlashCommandOption<"subcommand">)
  .option({
    type: "subcommand",
    name: "create",
    description: "creates a subgroup",
    options: [
      {
        type: "string",
        name: "name",
        description: "the name of the subgroup",
        required: true,
      },
      {
        type: "string",
        name: "creation",
        description:
          "the date that the subgroup was created (release date, etc.)",
      },
    ],
  } as SlashCommandOption<"subcommand">)
  .option({
    type: "subcommand",
    name: "edit",
    description: "edits a subgroup",
    options: [
      {
        type: "string",
        name: "subgroup",
        description: "the subgroup you'd like to edit",
        required: true,
        autocomplete: true,
      },
      {
        type: "string",
        name: "name",
        description: "the new name of the subgroup",
      },
      {
        type: "string",
        name: "creation",
        description: "the new creation date of the subgroup",
      },
    ],
  } as SlashCommandOption<"subcommand">);