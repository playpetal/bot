import {
  CommandInteraction,
  Constants,
  InteractionDataOptionsWithValue,
} from "eris";
import { createCharacter } from "../../../lib/graphql/mutation/CREATE_CHARACTER";
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

  const name = options.find((o) => o.name === "name")!.value as string;
  const birthday = options.find((o) => o.name === "birthday")?.value as
    | string
    | undefined;
  const gender = options.find((o) => o.name === "gender")?.value as
    | "MALE"
    | "FEMALE"
    | "NONBINARY"
    | undefined;

  const date = birthday ? new Date(birthday) : undefined;

  const character = await createCharacter(
    interaction.member!.user.id,
    name,
    date,
    gender
  );

  const embed = new Embed().setDescription(
    `the character **${character.name}** has been created!`
  );

  await interaction.createMessage({ embeds: [embed] });
}

const command = new SlashCommand(
  "createcharacter",
  "creates a new character",
  run,
  [
    {
      name: "name",
      description: "the name of the character",
      type: Constants.ApplicationCommandOptionTypes.STRING,
      required: true,
    },
    {
      name: "birthday",
      description: "the character's birthday",
      type: Constants.ApplicationCommandOptionTypes.STRING,
    },
    {
      name: "gender",
      description: "the character's gender",
      type: Constants.ApplicationCommandOptionTypes.STRING,
      choices: [
        { name: "male", value: "MALE" },
        { name: "female", value: "FEMALE" },
        { name: "nonbinary", value: "NONBINARY" },
      ],
    },
  ]
);

export default command;
