import {
  AutocompleteInteraction,
  CommandInteraction,
  Constants,
  InteractionDataOptionsWithValue,
} from "eris";
import { updateSubgroup } from "../../../../lib/graphql/mutation/UPDATE_SUBGROUP";
import { getUser } from "../../../../lib/graphql/query/GET_USER";
import { searchSubgroups } from "../../../../lib/graphql/query/SEARCH_SUBGROUPS";
import { SlashCommand } from "../../../../struct/command";
import { Embed, ErrorEmbed } from "../../../../struct/embed";

async function run(interaction: CommandInteraction) {
  const account = (await getUser({ discordId: interaction.member!.user.id }))!;

  if (!account.groups.find((g) => g.group.name === "Release Manager"))
    return await interaction.createMessage({
      embeds: [new ErrorEmbed("you don't have permission to do that :(")],
      flags: 64,
    });

  const options = interaction.data.options as InteractionDataOptionsWithValue[];

  const subgroup = options.find((o) => o.name === "subgroup")!;
  const newName = options.find((o) => o.name === "new_name")?.value as
    | string
    | undefined;
  const newCreation = options.find((o) => o.name === "new_creation")?.value as
    | string
    | undefined;

  let creation: Date | null | undefined;

  if (["none", "null"].includes(newCreation as string)) {
    creation = null;
  } else if (newCreation) {
    creation = new Date(newCreation);
  }

  if (!newName && creation === undefined) {
    return await interaction.createMessage({
      embeds: [
        new ErrorEmbed("you didn't change anything about the subgroup."),
      ],
      flags: 64,
    });
  }

  const newSubgroup = await updateSubgroup(
    interaction.member!.user.id,
    parseInt(subgroup.value as string, 10),
    newName,
    creation
  );

  await interaction.createMessage({
    embeds: [
      new Embed().setDescription(
        `the subgroup **${newSubgroup.name}** has been updated!\ncheck **/subgroupinfo \`${newSubgroup.name}\`** to see the new info!`
      ),
    ],
  });
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
    return { name: g.name, value: g.id.toString() };
  });

  await interaction.acknowledge(choices);
}

const command = new SlashCommand(
  "editsubgroup",
  "changes information about a subgroup",
  run,
  [
    {
      name: "subgroup",
      description: "the name of the subgroup",
      type: Constants.ApplicationCommandOptionTypes.STRING,
      required: true,
      autocomplete: true,
    },
    {
      name: "new_name",
      description: "what you'd like to change the subgroup's name to",
      type: Constants.ApplicationCommandOptionTypes.STRING,
    },
    {
      name: "new_creation",
      description:
        "what you'd like to change the subgroup's creation date to ('none' to remove)",
      type: Constants.ApplicationCommandOptionTypes.STRING,
    },
  ],
  runAutocomplete
);

export default command;
