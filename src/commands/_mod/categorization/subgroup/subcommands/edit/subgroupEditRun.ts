import { Run } from "petal";
import { updateSubgroup } from "../../../../../../lib/graphql/mutation/UPDATE_SUBGROUP";
import { getSubgroup } from "../../../../../../lib/graphql/query/GET_SUBGROUP";
import { ErrorEmbed, Embed } from "../../../../../../struct/embed";

const run: Run = async ({ interaction, user, options }) => {
  const name = options.getOption<string>("name")!;
  const creation = options.getOption<string>("creation");

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
};

export default run;
