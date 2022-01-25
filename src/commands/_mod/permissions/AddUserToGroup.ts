import {
  AutocompleteInteraction,
  CommandInteraction,
  Constants,
  InteractionDataOptionsWithValue,
} from "eris";
import { assignUserGroup } from "../../../lib/graphql/mutation/ASSIGN_USER_GROUP";
import { getUser } from "../../../lib/graphql/query/GET_USER";
import { getUserGroups } from "../../../lib/graphql/query/GET_USER_GROUPS";
import { SlashCommand } from "../../../struct/command";
import { Embed, ErrorEmbed } from "../../../struct/embed";

async function run(interaction: CommandInteraction) {
  const account = (await getUser(interaction.member!.user.id))!;

  if (!account.groups.find((g) => g.group.name === "Developer"))
    return await interaction.createMessage({
      embeds: [new ErrorEmbed("you don't have permission to do that :(")],
      flags: 64,
    });

  const options = interaction.data.options as InteractionDataOptionsWithValue[];

  const targetGroup = options.find((o) => o.name === "group")!.value as string;
  const group = (await getUserGroups(targetGroup))[0];

  if (!group) {
    return await interaction.createMessage({
      embeds: [new ErrorEmbed(`**${targetGroup}** is not a valid group.`)],
      flags: 64,
    });
  }

  const targetUserId = options.find((o) => o.name === "user")!.value as string;
  const targetUser = await getUser(targetUserId);

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
}

async function runAutocomplete(interaction: AutocompleteInteraction) {
  const options = interaction.data.options as {
    value: string;
    type: 3;
    name: string;
    focused?: boolean;
  }[];

  const focused = options.find((o) => o.focused)!;
  const groups = await getUserGroups(undefined, focused.value);

  const choices = groups.map((g) => {
    return { name: g.name, value: g.name };
  });

  await interaction.acknowledge(choices);
}

const command = new SlashCommand(
  "addusertogroup",
  "adds a user to a usergroup",
  run,
  [
    {
      name: "user",
      description: "the user you'd like to add to the group",
      type: Constants.ApplicationCommandOptionTypes.USER,
      required: true,
    },
    {
      name: "group",
      description: "the group you'd like to add the user to",
      type: Constants.ApplicationCommandOptionTypes.STRING,
      required: true,
      autocomplete: true,
    },
  ],
  runAutocomplete
);

export default command;
