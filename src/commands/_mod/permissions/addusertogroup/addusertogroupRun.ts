import { Run } from "petal";
import { assignUserGroup } from "../../../../lib/graphql/mutation/ASSIGN_USER_GROUP";
import { getUser } from "../../../../lib/graphql/query/GET_USER";
import { getUserGroups } from "../../../../lib/graphql/query/GET_USER_GROUPS";
import { ErrorEmbed, Embed } from "../../../../struct/embed";

const run: Run = async ({ interaction, options }) => {
  const account = (await getUser({ discordId: interaction.member!.user.id }))!;

  if (!account.groups.find((g) => g.group.name === "Developer"))
    return await interaction.createMessage({
      embeds: [new ErrorEmbed("you don't have permission to do that :(")],
      flags: 64,
    });

  const targetGroup = options.getOption<string>("group")!;
  const group = (await getUserGroups(targetGroup))[0];

  if (!group) {
    return await interaction.createMessage({
      embeds: [new ErrorEmbed(`**${targetGroup}** is not a valid group.`)],
      flags: 64,
    });
  }

  const targetUserId = options.getOption<string>("user");
  const targetUser = await getUser({ discordId: targetUserId });

  if (!targetUser) {
    return await interaction.createMessage({
      embeds: [
        new ErrorEmbed(
          `<@${targetUserId}> is not a valid user, or they don't have an account`
        ),
      ],
      flags: 64,
    });
  }

  if (targetUser.groups.find((g) => g.group.name === targetGroup)) {
    return await interaction.createMessage({
      embeds: [
        new ErrorEmbed(
          `**${targetUser.username}** is already assigned to **${group.name}**.`
        ),
      ],
      flags: 64,
    });
  }

  await assignUserGroup(targetUser.id, group.id, interaction.member!.user.id);

  const embed = new Embed().setDescription(
    `**${targetUser.username}** has been assigned to **${group.name}**.`
  );

  await interaction.createMessage({ embeds: [embed] });
};

export default run;
