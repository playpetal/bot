import {
  AutocompleteInteraction,
  CommandInteraction,
  Constants,
  InteractionDataOptionsWithValue,
} from "eris";
import { updateGroup } from "../../../../lib/graphql/mutation/UPDATE_GROUP";
import { getUser } from "../../../../lib/graphql/query/GET_USER";
import { searchGroups } from "../../../../lib/graphql/query/SEARCH_GROUPS";
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

  const group = options.find((o) => o.name === "group")!;
  const newName = options.find((o) => o.name === "new_name")?.value as
    | string
    | undefined;
  const newCreation = options.find((o) => o.name === "new_creation")?.value as
    | string
    | undefined;
  const newGender = options.find((o) => o.name === "new_gender")?.value as
    | "MALE"
    | "FEMALE"
    | "COED"
    | "null"
    | undefined;

  let creation: Date | null | undefined;

  if (["none", "null"].includes(newCreation as string)) {
    creation = null;
  } else if (newCreation) {
    creation = new Date(newCreation);
  }

  let gender: "MALE" | "FEMALE" | "COED" | null | undefined;

  if (newGender === "null") {
    gender = null;
  } else if (newGender !== undefined) {
    gender = newGender;
  }

  if (!newName && creation === undefined && gender === undefined) {
    return await interaction.createMessage({
      embeds: [new ErrorEmbed("you didn't change anything about the group.")],
      flags: 64,
    });
  }

  const newGroup = await updateGroup(
    interaction.member!.user.id,
    parseInt(group.value as string, 10),
    newName,
    creation,
    gender
  );

  await interaction.createMessage({
    embeds: [
      new Embed().setDescription(
        `the group **${newGroup.name}** has been updated!\ncheck **/groupinfo \`${newGroup.name}\`** to see the new info!`
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
  const groups = await searchGroups(focused.value);

  const choices = groups.map((g) => {
    return { name: g.name, value: g.id.toString() };
  });

  await interaction.acknowledge(choices);
}

const command = new SlashCommand(
  "editgroup",
  "changes information about a group",
  run,
  [
    {
      name: "group",
      description: "the name of the group",
      type: Constants.ApplicationCommandOptionTypes.STRING,
      required: true,
      autocomplete: true,
    },
    {
      name: "new_name",
      description: "what you'd like to change the group's name to",
      type: Constants.ApplicationCommandOptionTypes.STRING,
    },
    {
      name: "new_creation",
      description: "what you'd like to change the group's creation date to",
      type: Constants.ApplicationCommandOptionTypes.STRING,
    },
    {
      name: "new_gender",
      description: "what you'd like to change the group's gender to",
      type: Constants.ApplicationCommandOptionTypes.STRING,
      choices: [
        { name: "male", value: "MALE" },
        { name: "female", value: "FEMALE" },
        { name: "coed", value: "COED" },
        { name: "none", value: "null" },
      ],
    },
  ],
  runAutocomplete
);

export default command;
