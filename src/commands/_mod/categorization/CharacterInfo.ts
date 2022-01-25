import {
  AutocompleteInteraction,
  CommandInteraction,
  Constants,
  InteractionDataOptionsWithValue,
} from "eris";
import { getCharacters } from "../../../lib/graphql/query/GET_CHARACTERS";
import { searchCharacters } from "../../../lib/graphql/query/SEARCH_CHARACTERS";
import { SlashCommand } from "../../../struct/command";
import { Embed, ErrorEmbed } from "../../../struct/embed";

async function run(interaction: CommandInteraction) {
  const options = interaction.data.options as InteractionDataOptionsWithValue[];

  const id = options.find((o) => o.name === "character")!.value as string;
  const character = (await getCharacters({ id: parseInt(id, 10) }))[0];

  if (!character) {
    return await interaction.createMessage({
      embeds: [
        new ErrorEmbed("i didn't find a subgroup by that name or alias :("),
      ],
      flags: 64,
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
  const characters = await searchCharacters(focused.value);

  const choices = characters.map((g) => {
    return { name: `${g.name} (${g.id})`, value: g.id.toString() };
  });

  await interaction.acknowledge(choices);
}

const command = new SlashCommand(
  "characterinfo",
  "gets information about a character",
  run,
  [
    {
      name: "character",
      description: "the character you'd like information about",
      type: Constants.ApplicationCommandOptionTypes.STRING,
      required: true,
      autocomplete: true,
    },
  ],
  runAutocomplete
);

export default command;
