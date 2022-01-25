import {
  AutocompleteInteraction,
  CommandInteraction,
  Constants,
  InteractionDataOptionsWithValue,
} from "eris";
import { getCharacters } from "../../../../lib/graphql/query/GET_CHARACTERS";
import { getGroups } from "../../../../lib/graphql/query/GET_GROUPS";
import { getSubgroups } from "../../../../lib/graphql/query/GET_SUBGROUPS";
import { searchCharacters } from "../../../../lib/graphql/query/SEARCH_CHARACTERS";
import { searchGroups } from "../../../../lib/graphql/query/SEARCH_GROUPS";
import { searchSubgroups } from "../../../../lib/graphql/query/SEARCH_SUBGROUPS";
import { prefabCreationManager } from "../../../../lib/mod/createCard";
import { SlashCommand } from "../../../../struct/command";
import { Embed, ErrorEmbed } from "../../../../struct/embed";

async function run(interaction: CommandInteraction) {
  const options = interaction.data.options as InteractionDataOptionsWithValue[];

  const characterId = parseInt(
    options.find((o) => o.name === "character")!.value as string,
    10
  );
  const subgroupId = options.find((o) => o.name === "subgroup")?.value as
    | string
    | undefined;
  const groupId = options.find((o) => o.name === "group")?.value as
    | string
    | undefined;

  if (isNaN(characterId)) {
    return await interaction.createFollowup({
      embeds: [
        new ErrorEmbed("please select a character from the autocomplete!"),
      ],
    });
  }

  if (subgroupId && isNaN(parseInt(subgroupId, 10))) {
    return await interaction.createFollowup({
      embeds: [
        new ErrorEmbed("please select a subgroup from the autocomplete!"),
      ],
    });
  }

  if (groupId && isNaN(parseInt(groupId, 10))) {
    return await interaction.createFollowup({
      embeds: [new ErrorEmbed("please select a group from the autocomplete!")],
    });
  }

  let character, subgroup, group;

  character = (await getCharacters({ id: characterId }))[0];
  if (subgroupId)
    subgroup = (await getSubgroups({ id: parseInt(subgroupId, 10) }))[0];
  if (groupId) group = (await getGroups({ id: parseInt(groupId, 10) }))[0];

  const maxCards = parseInt(
    options.find((o) => o.name === "max_cards")?.value as string,
    10
  );
  const rarity = parseInt(
    options.find((o) => o.name === "rarity")?.value as string,
    10
  );

  const instance = prefabCreationManager.createInstance(
    interaction.member!.user,
    {
      characterId: character.id,
      subgroupId: subgroup?.id,
      groupId: group?.id,
      maxCards: isNaN(maxCards) ? undefined : maxCards,
      rarity: isNaN(rarity) ? undefined : rarity,
    }
  );

  const embed = new Embed().setDescription(
    "**Heads up!**" +
      "\n\nYou're creating a prefab with the following data:" +
      `\nCharacter: **${character.name}**` +
      `\nSubgroup: **${subgroup?.name || "None"}**` +
      `\nGroup: **${group?.name || "None"}**` +
      `\nMax Cards: **${instance.maxCards || "Unlimited"}**` +
      `\nRarity: **${instance.rarity || "Default"}**` +
      `\n\nTo upload an image, please **mention petal** with your image attached.`
  );

  const message = await interaction.createFollowup({ embeds: [embed] });

  setTimeout(async () => {
    const instance = prefabCreationManager.getInstance(
      interaction.member!.user
    );

    if (instance) {
      prefabCreationManager.deleteInstance(interaction.member!.user);
      await message.edit({
        embeds: [
          embed.setDescription(
            embed.description + `\n__**This prefab creation has timed out.**__`
          ),
        ],
      });
    }
  }, 60000);
}

async function runAutocomplete(interaction: AutocompleteInteraction) {
  const options = interaction.data.options as {
    value: string;
    type: 3;
    name: string;
    focused?: boolean;
  }[];

  const focused = options.find((o) => o.focused)!;

  let choices: { name: string; value: string }[];
  if (focused.name === "character") {
    const characters = await searchCharacters(focused.value);

    choices = characters.map((g) => {
      return { name: g.name, value: g.id.toString() };
    });
  } else if (focused.name === "subgroup") {
    const subgroups = await searchSubgroups(focused.value);

    choices = subgroups.map((g) => {
      return { name: g.name, value: g.id.toString() };
    });
  } else if (focused.name === "group") {
    const groups = await searchGroups(focused.value);

    choices = groups.map((g) => {
      return { name: g.name, value: g.id.toString() };
    });
  } else {
    choices = [];
  }

  await interaction.acknowledge(choices);
}

const command = new SlashCommand(
  "createprefab",
  "starts the prefab creation process",
  run,
  [
    {
      name: "character",
      description: "the character to create your prefab of",
      type: Constants.ApplicationCommandOptionTypes.STRING,
      required: true,
      autocomplete: true,
    },
    {
      name: "subgroup",
      description: "the subgroup to create your prefab of",
      type: Constants.ApplicationCommandOptionTypes.STRING,
      autocomplete: true,
    },
    {
      name: "group",
      description: "the group to create your prefab of",
      type: Constants.ApplicationCommandOptionTypes.STRING,
      autocomplete: true,
    },
    {
      name: "max_cards",
      description:
        "the maximum number of cards that can be created from your prefab",
      type: Constants.ApplicationCommandOptionTypes.INTEGER,
    },
    {
      name: "rarity",
      description: "the relative rarity of your prefab (currently unused)",
      type: Constants.ApplicationCommandOptionTypes.INTEGER,
    },
  ],
  runAutocomplete
);

export default command;
