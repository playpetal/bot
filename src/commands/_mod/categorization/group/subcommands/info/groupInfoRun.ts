import { Run } from "petal";
import { getGroup } from "../../../../../../lib/graphql/query/GET_GROUP";
import { ErrorEmbed, Embed } from "../../../../../../struct/embed";

const run: Run = async ({ interaction, options }) => {
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
};

export default run;
