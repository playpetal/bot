import { Run } from "petal";
import { getSubgroup } from "../../../../../../lib/graphql/query/GET_SUBGROUP";
import { ErrorEmbed, Embed } from "../../../../../../struct/embed";

const run: Run = async ({ interaction, options }) => {
  const strSubgroupId = options.getOption<string>("subgroup")!;
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
};

export default run;
