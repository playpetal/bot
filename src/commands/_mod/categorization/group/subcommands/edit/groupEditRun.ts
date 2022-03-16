import { Run, GroupGender } from "petal";
import { updateGroup } from "../../../../../../lib/graphql/mutation/UPDATE_GROUP";
import { getGroup } from "../../../../../../lib/graphql/query/GET_GROUP";
import { ErrorEmbed, Embed } from "../../../../../../struct/embed";

const run: Run = async ({ interaction, user, options }) => {
  const name = options.getOption<string>("name");
  const creation = options.getOption<string>("creation");
  const gender = options.getOption<"male" | "female" | "coed">("gender");

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
};

export default run;
