import { GroupGender } from "petal";
import { slashCommand } from "../../../lib/command";
import { CONSTANTS } from "../../../lib/constants";
import { createGroup } from "../../../lib/graphql/mutation/CREATE_GROUP";
import { updateGroup } from "../../../lib/graphql/mutation/UPDATE_GROUP";
import { getGroup } from "../../../lib/graphql/query/GET_GROUP";
import { searchGroups } from "../../../lib/graphql/query/SEARCH_GROUPS";
import { Autocomplete, Run } from "../../../struct/command";
import { Embed, ErrorEmbed } from "../../../struct/embed";

const run: Run = async ({ interaction, user, options }) => {
  const subcommand = options.getSubcommand()!;

  if (subcommand.name === "info") {
    const strGroupId = options.getOption<string>("group")!;
    const groupId = parseInt(strGroupId, 10);

    if (isNaN(groupId)) {
      return await interaction.createMessage({
        embeds: [new ErrorEmbed("please select a group from the dropdown!")],
      });
    }

    const group = await getGroup(groupId);

    if (!group) {
      return await interaction.createMessage({
        embeds: [new ErrorEmbed("please select a group from the dropdown!")],
      });
    }

    const creation = group.creation
      ? new Date(group.creation).toLocaleString("en-us", {
          month: "long",
          day: "numeric",
          year: "numeric",
          timeZone: "UTC",
        })
      : "None";

    const embed = new Embed().setDescription(
      `**Group Info**\nName: **${
        group.name
      }**\nCreation: **${creation}**\nGender: **${
        group.gender || "None"
      }**\nAliases: **${
        group.aliases.length > 0
          ? group.aliases.map((a) => a.alias).join(", ")
          : "None"
      }**\nID: ${group.id}`
    );

    return interaction.createMessage({ embeds: [embed] });
  }

  const name = options.getOption<string>("name");
  const creation = options.getOption<string>("creation");
  const gender = options.getOption<"male" | "female" | "coed">("gender");

  if (subcommand.name === "create") {
    const group = await createGroup(
      user.discordId,
      name!,
      creation ? new Date(creation) : undefined,
      gender?.toUpperCase() as GroupGender | undefined
    );

    const embed = new Embed().setDescription(
      `the group **${group.name}** has been created!`
    );

    return interaction.createMessage({ embeds: [embed] });
  } else if (subcommand.name === "edit") {
    const strGroupId = options.getOption<string>("group")!;
    const groupId = parseInt(strGroupId, 10);

    if (isNaN(groupId)) {
      return await interaction.createMessage({
        embeds: [new ErrorEmbed("please select a group from the dropdown!")],
      });
    }

    const group = await getGroup(groupId);

    if (!group) {
      return await interaction.createMessage({
        embeds: [new ErrorEmbed("please select a group from the dropdown!")],
      });
    }

    const newGroup = await updateGroup(
      user.discordId,
      group.id,
      name,
      creation ? new Date(creation) : undefined,
      gender?.toUpperCase() as GroupGender | undefined
    );

    return interaction.createMessage({
      embeds: [
        new Embed().setDescription(
          `the group **${newGroup.name}** has been updated!\ncheck **/group info \`${newGroup.name}\`** to see the new info!`
        ),
      ],
    });
  }
};

const autocomplete: Autocomplete = async ({ interaction, options }) => {
  const focused = options.getFocused()!;
  let choices: { name: string; value: string }[] = [];
  const nested = focused.options!.find((o) => o.focused)!;

  if (nested.name === "group") {
    const groups = await searchGroups(nested.value as string);

    choices = groups.map((g) => {
      const creation = g.creation
        ? new Date(g.creation).toISOString().split("T")[0]
        : "No Date";
      return { name: `${g.name} (${creation})`, value: g.id.toString() };
    });
  }

  return interaction.acknowledge(choices);
};

export default slashCommand("group")
  .run(run)
  .autocomplete(autocomplete)
  .option({
    type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
    name: "info",
    description: "shows information about a group",
    options: [
      {
        type: CONSTANTS.OPTION_TYPE.STRING,
        name: "group",
        description: "the group you'd like to view information about",
        required: true,
        autocomplete: true,
      },
    ],
  })
  .option({
    type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
    name: "create",
    description: "create a new group",
    options: [
      {
        type: CONSTANTS.OPTION_TYPE.STRING,
        name: "name",
        description: "the name of the group you want to create",
        required: true,
      },
      {
        type: CONSTANTS.OPTION_TYPE.STRING,
        name: "creation",
        description: "the date your group was created (debut date, etc.)",
      },
      {
        type: CONSTANTS.OPTION_TYPE.STRING,
        name: "gender",
        description: "the gender of your group",
        choices: [
          { name: "male", value: "male" },
          { name: "female", value: "female" },
          { name: "coed", value: "coed" },
        ],
      },
    ],
  })
  .option({
    type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
    name: "edit",
    description: "edits a group",
    options: [
      {
        type: CONSTANTS.OPTION_TYPE.STRING,
        name: "group",
        description: "the group you want to edit",
        required: true,
        autocomplete: true,
      },
      {
        type: CONSTANTS.OPTION_TYPE.STRING,
        name: "name",
        description: "the new name of the group",
      },
      {
        type: CONSTANTS.OPTION_TYPE.STRING,
        name: "creation",
        description: "the new creation date of the group (debut date, etc.)",
      },
      {
        type: CONSTANTS.OPTION_TYPE.STRING,
        name: "gender",
        description: "the new gender date of the group (debut date, etc.)",
        choices: [
          { name: "male", value: "male" },
          { name: "female", value: "female" },
          { name: "coed", value: "coed" },
        ],
      },
    ],
  });
