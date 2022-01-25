import {
  AutocompleteInteraction,
  CommandInteraction,
  Constants,
  InteractionDataOptionsWithValue,
} from "eris";
import { updateCharacter } from "../../../../lib/graphql/mutation/UPDATE_CHARACTER";
import { updateGroup } from "../../../../lib/graphql/mutation/UPDATE_GROUP";
import { getUser } from "../../../../lib/graphql/query/GET_USER";
import { searchCharacters } from "../../../../lib/graphql/query/SEARCH_CHARACTERS";
import { SlashCommand } from "../../../../struct/command";
import { Embed, ErrorEmbed } from "../../../../struct/embed";

async function run(interaction: CommandInteraction) {
  const account = (await getUser(interaction.member!.user.id))!;

  if (!account.groups.find((g) => g.group.name === "Release Manager"))
    return await interaction.createMessage({
      embeds: [new ErrorEmbed("you don't have permission to do that :(")],
      flags: 64,
    });

  const options = interaction.data.options as InteractionDataOptionsWithValue[];

  const character = options.find((o) => o.name === "character")!;
  const newName = options.find((o) => o.name === "new_name")?.value as
    | string
    | undefined;
  const newBirthday = options.find((o) => o.name === "new_birthday")?.value as
    | string
    | undefined;
  const newGender = options.find((o) => o.name === "new_gender")?.value as
    | "MALE"
    | "FEMALE"
    | "NONBINARY"
    | "null"
    | undefined;

  let birthday: Date | null | undefined;

  if (["none", "null"].includes(newBirthday as string)) {
    birthday = null;
  } else if (newBirthday) {
    birthday = new Date(newBirthday);
  }

  let gender: "MALE" | "FEMALE" | "NONBINARY" | null | undefined;

  if (newGender === "null") {
    gender = null;
  } else if (newGender !== undefined) {
    gender = newGender;
  }

  if (!newName && birthday === undefined && gender === undefined) {
    return await interaction.createMessage({
      embeds: [new ErrorEmbed("you didn't change anything about the group.")],
      flags: 64,
    });
  }

  const newCharacter = await updateCharacter(
    interaction.member!.user.id,
    parseInt(character.value as string, 10),
    newName,
    birthday,
    gender
  );

  await interaction.createMessage({
    embeds: [
      new Embed().setDescription(
        `the character **${newCharacter.name}** has been updated!\ncheck **/characterinfo \`${newCharacter.name}\`** to see the new info!`
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
  const characters = await searchCharacters(focused.value);

  const choices = characters.map((c) => {
    return { name: c.name, value: c.id.toString() };
  });

  await interaction.acknowledge(choices);
}

const command = new SlashCommand(
  "editcharacter",
  "changes information about a character",
  run,
  [
    {
      name: "character",
      description: "the name of the character",
      type: Constants.ApplicationCommandOptionTypes.STRING,
      required: true,
      autocomplete: true,
    },
    {
      name: "new_name",
      description: "what you'd like to change the character's name to",
      type: Constants.ApplicationCommandOptionTypes.STRING,
    },
    {
      name: "new_birthday",
      description: "what you'd like to change the character's birthday to",
      type: Constants.ApplicationCommandOptionTypes.STRING,
    },
    {
      name: "new_gender",
      description: "what you'd like to change the character's gender to",
      type: Constants.ApplicationCommandOptionTypes.STRING,
      choices: [
        { name: "male", value: "MALE" },
        { name: "female", value: "FEMALE" },
        { name: "nonbinary", value: "NONBINARY" },
        { name: "none", value: "null" },
      ],
    },
  ],
  runAutocomplete
);

export default command;
