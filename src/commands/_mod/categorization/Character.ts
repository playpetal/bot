import { Gender, InteractionOption, SlashCommandOption } from "petal";
import { createCharacter } from "../../../lib/graphql/mutation/CREATE_CHARACTER";
import { updateCharacter } from "../../../lib/graphql/mutation/UPDATE_CHARACTER";
import { getCharacter } from "../../../lib/graphql/query/GET_CHARACTER";
import { searchCharacters } from "../../../lib/graphql/query/SEARCH_CHARACTERS";
import { Autocomplete, Run, SlashCommand } from "../../../struct/command";
import { ErrorEmbed, Embed } from "../../../struct/embed";

const run: Run = async ({ interaction, user, options }) => {
  const subcommand = options.options[0] as InteractionOption<boolean>;

  if (subcommand.name === "info") {
    const strCharacterId = subcommand.options![0].value as string;
    const characterId = parseInt(strCharacterId, 10);

    if (isNaN(characterId)) {
      return await interaction.createMessage({
        embeds: [
          new ErrorEmbed("please select a character from the dropdown!"),
        ],
      });
    }

    const character = await getCharacter(characterId);

    if (!character) {
      return await interaction.createMessage({
        embeds: [
          new ErrorEmbed("please select a character from the dropdown!"),
        ],
      });
    }

    const birthday = character.birthday
      ? new Date(character.birthday).toLocaleString("en-us", {
          month: "long",
          day: "numeric",
          year: "numeric",
          timeZone: "UTC",
        })
      : "None";

    const embed = new Embed().setDescription(
      `**Character Info**\nName: **${
        character.name
      }**\nBirthday: **${birthday}**\nGender: **${
        character.gender || "None"
      }**\nID: **${character.id}**`
    );

    return interaction.createMessage({ embeds: [embed] });
  }

  const name = subcommand.options!.find((o) => o.name === "name")!.value as
    | string
    | undefined;
  const birthday = subcommand.options!.find((o) => o.name === "birthday")
    ?.value as string | undefined;
  const gender = subcommand.options!.find((o) => o.name === "gender")?.value as
    | "male"
    | "female"
    | "nonbinary"
    | undefined;

  if (subcommand.name === "create") {
    const date = birthday ? new Date(birthday) : undefined;

    const character = await createCharacter(
      interaction.member!.user.id,
      name!,
      date,
      gender?.toUpperCase() as Gender | undefined
    );

    const embed = new Embed().setDescription(
      `the character **${character.name}** has been created!`
    );

    return interaction.createMessage({ embeds: [embed] });
  } else if (subcommand.name === "edit") {
    const strCharacterId = subcommand.options![0].value as string;
    const characterId = parseInt(strCharacterId, 10);

    if (isNaN(characterId)) {
      return await interaction.createMessage({
        embeds: [
          new ErrorEmbed("please select a character from the dropdown!"),
        ],
      });
    }

    const character = await getCharacter(characterId);

    if (!character) {
      return await interaction.createMessage({
        embeds: [
          new ErrorEmbed("please select a character from the dropdown!"),
        ],
      });
    }

    if (!name && birthday === undefined && gender === undefined) {
      return await interaction.createMessage({
        embeds: [
          new ErrorEmbed("you didn't change anything about the character."),
        ],
        flags: 64,
      });
    }

    const date = birthday ? new Date(birthday) : undefined;

    const newCharacter = await updateCharacter(
      user.discordId,
      character.id,
      name,
      date,
      gender?.toUpperCase() as Gender | undefined
    );

    await interaction.createMessage({
      embeds: [
        new Embed().setDescription(
          `the character **${newCharacter.name}** has been updated!\ncheck **/characterinfo \`${newCharacter.name}\`** to see the new info!`
        ),
      ],
    });
  }
};

const autocomplete: Autocomplete = async ({ interaction, options }) => {
  const focused = options.getFocused()!;
  let choices: { name: string; value: string }[] = [];
  const nested = focused.options!.find((o) => o.focused)!;

  if (nested.name === "character") {
    const characters = await searchCharacters(nested.value as string);

    choices = characters.map((c) => {
      const birthday = c.birthday
        ? new Date(c.birthday).toISOString().split("T")[0]
        : "No Birthday";
      return { name: `${c.name} (${birthday})`, value: c.id.toString() };
    });
  }

  return interaction.acknowledge(choices);
};

export default new SlashCommand("character")
  .run(run)
  .autocomplete(autocomplete)
  .option({
    type: "subcommand",
    name: "info",
    description: "shows information about a character",
    options: [
      {
        type: "string",
        name: "character",
        description: "the character you'd like to view information about",
        required: true,
        autocomplete: true,
      } as SlashCommandOption<"string">,
    ],
  } as SlashCommandOption<"subcommand">)
  .option({
    type: "subcommand",
    name: "create",
    description: "creates a new character",
    options: [
      {
        type: "string",
        name: "name",
        description: "the name of the character",
        required: true,
      } as SlashCommandOption<"string">,
      {
        type: "string",
        name: "birthday",
        description: "the birthday of the character",
      } as SlashCommandOption<"string">,
      {
        type: "string",
        name: "gender",
        description: "the gender of the character",
        choices: [
          { name: "male", value: "male" },
          { name: "female", value: "female" },
          { name: "nonbinary", value: "nonbinary" },
        ],
      } as SlashCommandOption<"string">,
    ],
  } as SlashCommandOption<"subcommand">)
  .option({
    type: "subcommand",
    name: "edit",
    description: "edits a character",
    options: [
      {
        type: "string",
        name: "character",
        description: "the name of the character you'd like to edit",
        required: true,
        autocomplete: true,
      } as SlashCommandOption<"string">,
      {
        type: "string",
        name: "name",
        description: "the name of the character",
      } as SlashCommandOption<"string">,
      {
        type: "string",
        name: "birthday",
        description: "the birthday of the character",
      } as SlashCommandOption<"string">,
      {
        type: "string",
        name: "gender",
        description: "the gender of the character",
        choices: [
          { name: "male", value: "male" },
          { name: "female", value: "female" },
          { name: "nonbinary", value: "nonbinary" },
        ],
      } as SlashCommandOption<"string">,
    ],
  });
