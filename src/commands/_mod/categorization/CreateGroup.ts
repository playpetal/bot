import {
  CommandInteraction,
  Constants,
  InteractionDataOptionsWithValue,
} from "eris";
import { createGroup } from "../../../lib/graphql/mutation/CREATE_GROUP";
import { getUser } from "../../../lib/graphql/query/GET_USER";
import { SlashCommand } from "../../../struct/command";
import { Embed, ErrorEmbed } from "../../../struct/embed";

async function run(interaction: CommandInteraction) {
  const account = (await getUser(interaction.member!.user.id))!;

  if (!account.groups.find((g) => g.group.name === "Release Manager"))
    return await interaction.createMessage({
      embeds: [new ErrorEmbed("you don't have permission to do that :(")],
      flags: 64,
    });

  const options = interaction.data.options as InteractionDataOptionsWithValue[];

  const groupName = options.find((o) => o.name === "name")!.value as string;
  const groupCreation = options.find((o) => o.name === "creation")?.value as
    | string
    | undefined;
  const groupGender = options.find((o) => o.name === "gender")?.value as
    | "MALE"
    | "FEMALE"
    | "COED"
    | undefined;

  const date = groupCreation ? new Date(groupCreation) : undefined;

  const group = await createGroup(
    interaction.member!.user.id,
    groupName,
    date,
    groupGender
  );

  const embed = new Embed().setDescription(
    `the group **${group.name}** has been created!`
  );

  await interaction.createMessage({ embeds: [embed] });
}

const command = new SlashCommand("creategroup", "creates a new group", run, [
  {
    name: "name",
    description: "the name of the group",
    type: Constants.ApplicationCommandOptionTypes.STRING,
    required: true,
  },
  {
    name: "creation",
    description:
      "the date that the group was created or formed (debut date, etc)",
    type: Constants.ApplicationCommandOptionTypes.STRING,
  },
  {
    name: "gender",
    description: "the gender of the group",
    type: Constants.ApplicationCommandOptionTypes.STRING,
    choices: [
      { name: "male", value: "MALE" },
      { name: "female", value: "FEMALE" },
      { name: "coed", value: "COED" },
    ],
  },
]);

export default command;
