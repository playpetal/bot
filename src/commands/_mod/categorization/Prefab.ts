import axios from "axios";
import { Character, Group, Maybe, Prefab, Subgroup } from "petal";
import { CONSTANTS } from "../../../lib/constants";
import { updatePrefab } from "../../../lib/graphql/mutation/categorization/prefab/UPDATE_PREFAB";
import { createPrefab } from "../../../lib/graphql/mutation/CREATE_PREFAB";
import { getPrefab } from "../../../lib/graphql/query/categorization/prefab/GET_PREFAB";
import { getLastRelease } from "../../../lib/graphql/query/categorization/release/GET_LAST_RELEASE";
import { getCharacter } from "../../../lib/graphql/query/GET_CHARACTER";
import { getGroup } from "../../../lib/graphql/query/GET_GROUP";
import { getSubgroup } from "../../../lib/graphql/query/GET_SUBGROUP";
import { searchCharacters } from "../../../lib/graphql/query/SEARCH_CHARACTERS";
import { searchGroups } from "../../../lib/graphql/query/SEARCH_GROUPS";
import { searchPrefabs } from "../../../lib/graphql/query/SEARCH_PREFABS";
import { searchSubgroups } from "../../../lib/graphql/query/SEARCH_SUBGROUPS";
import { uploadImage } from "../../../lib/img";
import { Autocomplete, Run, SlashCommand } from "../../../struct/command";
import { Embed, ErrorEmbed } from "../../../struct/embed";

const run: Run = async ({ interaction, options, user }) => {
  const subcommand = options.getSubcommand()!;

  let isEdit: { prefabId: number } | undefined;
  let prefab: Maybe<Prefab> | undefined;
  let character: Maybe<Character> | undefined;
  let subgroup: Maybe<Subgroup> | undefined;
  let group: Maybe<Group> | undefined;
  let maxCards: number | undefined;
  let rarity: number | undefined;
  let releaseId: number | undefined;
  let image: string | undefined;

  const attachmentId = options.getOption<string>("image");

  if (attachmentId) {
    // @ts-ignore
    image = interaction.data.resolved?.attachments[attachmentId].url;
  }

  if (subcommand.name === "edit") {
    const strPrefabId = options.getOption<string>("prefab")!;
    const prefabId = parseInt(strPrefabId, 10);

    if (isNaN(prefabId)) {
      return interaction.createMessage({
        embeds: [new ErrorEmbed("please select a prefab from the dropdown!")],
      });
    }

    prefab = await getPrefab(prefabId);

    if (!prefab) {
      return interaction.createMessage({
        embeds: [new ErrorEmbed("please select a prefab from the dropdown!")],
      });
    }

    isEdit = { prefabId: prefab.id };
  }

  const strCharacterId = options.getOption<string>("character");

  if (strCharacterId) {
    const characterId = parseInt(strCharacterId, 10);

    if (isNaN(characterId)) {
      return interaction.createMessage({
        embeds: [
          new ErrorEmbed("please select a character from the dropdown!"),
        ],
      });
    }

    character = await getCharacter(characterId);
  }

  const strSubgroupId = options.getOption<string>("subgroup");

  if (strSubgroupId) {
    const subgroupId = parseInt(strSubgroupId, 10);

    if (isNaN(subgroupId)) {
      return interaction.createMessage({
        embeds: [new ErrorEmbed("please select a subgroup from the dropdown!")],
      });
    }

    subgroup = await getSubgroup(subgroupId);
  }

  const strGroupId = options.getOption<string>("group");

  if (strGroupId) {
    const groupId = parseInt(strGroupId, 10);

    if (isNaN(groupId)) {
      return interaction.createMessage({
        embeds: [new ErrorEmbed("please select a group from the dropdown!")],
      });
    }

    group = await getGroup(groupId);
  }

  maxCards = options.getOption<number>("max_cards");
  rarity = options.getOption<number>("rarity");
  releaseId = options.getOption<number>("release");

  if (!releaseId && !isEdit) {
    const lastRelease = await getLastRelease();
    if (lastRelease) releaseId = lastRelease.id;
  }

  const embed = new Embed();
  let card: Buffer | undefined;

  if (isEdit) {
    await updatePrefab({
      senderId: user.discordId,
      id: prefab!.id,
      characterId: character?.id,
      subgroupId: subgroup?.id,
      groupId: group?.id,
      maxCards,
      rarity,
      releaseId,
    });

    if (image) await uploadImage(image, prefab!.id, "prefab");

    embed.setDescription(
      "**heads up!** you just edited a prefab:" +
        `\n**${prefab!.group ? `${prefab!.group.name} ` : ""}${
          prefab!.character.name
        }${prefab!.subgroup ? ` ${prefab!.subgroup.name}` : ""}**, rarity **${
          prefab!.rarity
        }**, max cards **${prefab!.maxCards}**, release **${
          prefab!.release.id
        }**` +
        `\n\nto the following:` +
        `\n**${
          group
            ? `${group.name} `
            : prefab!.group
            ? `${prefab!.group.name} `
            : ""
        }${character ? character.name : prefab!.character.name}${
          subgroup
            ? ` ${subgroup.name}`
            : prefab!.subgroup
            ? ` ${prefab!.subgroup.name}`
            : ""
        }**, rarity **${rarity || prefab!.rarity}**, max cards **${
          maxCards || prefab!.maxCards
        }**, release **${releaseId || prefab!.release.id}**`
    );

    if (image) embed.setImage("attachment://collage.png");
  } else {
    prefab = await createPrefab(user.discordId, {
      characterId: character!.id,
      subgroupId: subgroup?.id,
      groupId: group?.id,
      maxCards,
      rarity,
      releaseId,
    });

    await uploadImage(image!, prefab.id, "prefab");

    embed
      .setDescription(
        "**heads up!** you just created a prefab:" +
          `\n**${group ? `${group.name} ` : ""}${character!.name}${
            subgroup ? ` ${subgroup.name}` : ""
          }**, rarity **${rarity || "default"}**, max cards **${
            maxCards || "default"
          }**, release **${releaseId || "New Release  "}**`
      )
      .setImage("attachment://collage.png");
  }

  if (image) {
    const { data } = (await axios.post(`${process.env.ONI_URL}/card`, [
      {
        character: image,
        frame: "#FFAACC",
        name: "Prefab",
        id: Date.now(),
      },
    ])) as { data: { card: string } };
    card = Buffer.from(data.card, "base64");
  }

  await interaction.createFollowup(
    {
      embeds: [embed],
    },
    card ? [{ file: card, name: "collage.png" }] : undefined
  );
};

const autocomplete: Autocomplete = async ({ interaction, options }) => {
  const focused = options.getFocused()!;
  let choices: { name: string; value: string }[] = [];

  const nested = focused.options!.find((o) => o.focused)!;

  if (nested.name === "prefab") {
    const search = await searchPrefabs(nested.value as string);

    choices = search.map((p) => {
      let str = p.character.name;

      if (p.group) str = `${p.group.name} ${str}`;
      if (p.subgroup) str = `${str} ${p.subgroup.name}`;

      str += ` (${p.id})`;

      return { name: str, value: p.id.toString() };
    });
  } else if (nested.name === "character") {
    const search = await searchCharacters(nested.value as string);

    choices = search.map((c) => {
      const birthday = c.birthday
        ? new Date(c.birthday).toISOString().split("T")[0]
        : "No Birthday";
      return { name: `${c.name} (${birthday})`, value: c.id.toString() };
    });
  } else if (nested.name === "subgroup") {
    const search = await searchSubgroups(nested.value as string);

    choices = search.map((c) => {
      const date = c.creation
        ? new Date(c.creation).toISOString().split("T")[0]
        : "No Date";
      return { name: `${c.name} (${date})`, value: c.id.toString() };
    });
  } else if (nested.name === "group") {
    const search = await searchGroups(nested.value as string);

    choices = search.map((c) => {
      const date = c.creation
        ? new Date(c.creation).toISOString().split("T")[0]
        : "No Date";
      return { name: `${c.name} (${date})`, value: c.id.toString() };
    });
  }

  return interaction.acknowledge(choices);
};

export default new SlashCommand("prefab")
  .run(run)
  .autocomplete(autocomplete)
  .option({
    type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
    name: "create",
    description: "create a prefab",
    options: [
      {
        type: CONSTANTS.OPTION_TYPE.STRING,
        name: "character",
        description: "the character you'd like to set the prefab to",
        required: true,
        autocomplete: true,
      },
      {
        type: CONSTANTS.OPTION_TYPE.ATTACHMENT,
        name: "image",
        description: "the image of the prefab you'd like to create",
        required: true,
      },
      {
        type: CONSTANTS.OPTION_TYPE.INTEGER,
        name: "release",
        description:
          "the release to put the prefab in. if empty, creates new release or adds to last undroppable release.",
      },
      {
        type: CONSTANTS.OPTION_TYPE.STRING,
        name: "subgroup",
        description: "the subgroup you'd like to set the prefab to",
        autocomplete: true,
      },
      {
        type: CONSTANTS.OPTION_TYPE.STRING,
        name: "group",
        description: "the group you'd like to set the prefab to",
        autocomplete: true,
      },
      {
        type: CONSTANTS.OPTION_TYPE.NUMBER,
        name: "max_cards",
        description: "the max cards of the prefab",
      },
      {
        type: CONSTANTS.OPTION_TYPE.NUMBER,
        name: "rarity",
        description: "the relative rarity of the prefab (currently unused)",
      },
    ],
  })
  .option({
    type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
    name: "edit",
    description: "edit a prefab",
    options: [
      {
        type: CONSTANTS.OPTION_TYPE.STRING,
        name: "prefab",
        description: "the prefab you'd like to edit",
        required: true,
        autocomplete: true,
      },
      {
        type: CONSTANTS.OPTION_TYPE.STRING,
        name: "character",
        description: "the character you'd like to set the prefab to",
        autocomplete: true,
      },
      {
        type: CONSTANTS.OPTION_TYPE.ATTACHMENT,
        name: "image",
        description: "the image you'd like to set the prefab to",
      },
      {
        type: CONSTANTS.OPTION_TYPE.INTEGER,
        name: "release",
        description: "the number of the release to put the prefab in",
      },
      {
        type: CONSTANTS.OPTION_TYPE.STRING,
        name: "subgroup",
        description: "the subgroup you'd like to set the prefab to",
        autocomplete: true,
      },
      {
        type: CONSTANTS.OPTION_TYPE.STRING,
        name: "group",
        description: "the group you'd like to set the prefab to",
        autocomplete: true,
      },
      {
        type: CONSTANTS.OPTION_TYPE.NUMBER,
        name: "max_cards",
        description: "the new max cards of the prefab",
      },
      {
        type: CONSTANTS.OPTION_TYPE.NUMBER,
        name: "rarity",
        description: "the new relative rarity of the prefab (currently unused)",
      },
    ],
  });
