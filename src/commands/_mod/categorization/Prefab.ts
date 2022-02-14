import axios from "axios";
import {
  Character,
  Group,
  InteractionOption,
  Maybe,
  Prefab,
  SlashCommandOption,
  Subgroup,
} from "petal";
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
import { getCardImage } from "../../../lib/img";
import { Autocomplete, Run, SlashCommand } from "../../../struct/command";
import { Embed, ErrorEmbed } from "../../../struct/embed";

const run: Run = async ({ interaction, options, user }) => {
  const subcommand = options.options[0] as InteractionOption<boolean>;
  const fields = subcommand.options!;

  let isEdit: { prefabId: number } | undefined;
  let prefab: Maybe<Prefab> | undefined;
  let character: Maybe<Character> | undefined;
  let subgroup: Maybe<Subgroup> | undefined;
  let group: Maybe<Group> | undefined;
  let maxCards: number | undefined;
  let rarity: number | undefined;
  let releaseId: number | undefined;
  let image: string | undefined;

  const attachmentId = subcommand.options!.find((o) => o.name === "image")
    ?.value as string | undefined;

  if (attachmentId) {
    // @ts-ignore
    image = interaction.data.resolved?.attachments[attachmentId].url;
  }

  if (subcommand.name === "edit") {
    const strPrefabId = fields.find((o) => o.name === "prefab")!
      .value as string;
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

  const strCharacterId = fields.find((f) => f.name === "character")?.value as
    | string
    | undefined;

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

  const strSubgroupId = fields.find((f) => f.name === "subgroup")?.value as
    | string
    | undefined;

  if (strSubgroupId) {
    const subgroupId = parseInt(strSubgroupId, 10);

    if (isNaN(subgroupId)) {
      return interaction.createMessage({
        embeds: [new ErrorEmbed("please select a subgroup from the dropdown!")],
      });
    }

    subgroup = await getSubgroup(subgroupId);
  }

  const strGroupId = fields.find((f) => f.name === "group")?.value as
    | string
    | undefined;

  if (strGroupId) {
    const groupId = parseInt(strGroupId, 10);

    if (isNaN(groupId)) {
      return interaction.createMessage({
        embeds: [new ErrorEmbed("please select a group from the dropdown!")],
      });
    }

    group = await getGroup(groupId);
  }

  maxCards = fields.find((f) => f.name === "max_cards")?.value as
    | number
    | undefined;
  rarity = fields.find((f) => f.name === "rarity")?.value as number | undefined;
  releaseId = fields.find((f) => f.name === "release")?.value as
    | number
    | undefined;

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
      maxCards,
      rarity,
      releaseId,
    });

    if (image) {
      await axios.post(`${process.env.ONI_URL}/upload`, {
        url: image,
        id: prefab!.id.toString(),
      });
    }

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

    await axios.post(`${process.env.ONI_URL}/upload`, {
      url: image!,
      id: prefab.id.toString(),
    });

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
    type: "subcommand",
    name: "create",
    description: "create a prefab",
    options: [
      {
        type: "string",
        name: "character",
        description: "the character you'd like to set the prefab to",
        required: true,
        autocomplete: true,
      } as SlashCommandOption<"string">,
      {
        type: "attachment",
        name: "image",
        description: "the image of the prefab you'd like to create",
        required: true,
      } as SlashCommandOption<"attachment">,
      {
        type: "integer",
        name: "release",
        description:
          "the release to put the prefab in. if empty, creates new release or adds to last undroppable release.",
      } as SlashCommandOption<"integer">,
      {
        type: "string",
        name: "subgroup",
        description: "the subgroup you'd like to set the prefab to",
        autocomplete: true,
      } as SlashCommandOption<"string">,
      {
        type: "string",
        name: "group",
        description: "the group you'd like to set the prefab to",
        autocomplete: true,
      } as SlashCommandOption<"string">,
      {
        type: "number",
        name: "max_cards",
        description: "the max cards of the prefab",
      } as SlashCommandOption<"number">,
      {
        type: "number",
        name: "rarity",
        description: "the relative rarity of the prefab (currently unused)",
      } as SlashCommandOption<"number">,
    ],
  })
  .option({
    type: "subcommand",
    name: "edit",
    description: "edit a prefab",
    options: [
      {
        type: "string",
        name: "prefab",
        description: "the prefab you'd like to edit",
        required: true,
        autocomplete: true,
      } as SlashCommandOption<"string">,
      {
        type: "string",
        name: "character",
        description: "the character you'd like to set the prefab to",
        autocomplete: true,
      } as SlashCommandOption<"string">,
      {
        type: "attachment",
        name: "image",
        description: "the image you'd like to set the prefab to",
      } as SlashCommandOption<"attachment">,
      {
        type: "integer",
        name: "release",
        description: "the number of the release to put the prefab in",
      } as SlashCommandOption<"integer">,
      {
        type: "string",
        name: "subgroup",
        description: "the subgroup you'd like to set the prefab to",
        autocomplete: true,
      } as SlashCommandOption<"string">,
      {
        type: "string",
        name: "group",
        description: "the group you'd like to set the prefab to",
        autocomplete: true,
      } as SlashCommandOption<"string">,
      {
        type: "number",
        name: "max_cards",
        description: "the new max cards of the prefab",
      } as SlashCommandOption<"number">,
      {
        type: "number",
        name: "rarity",
        description: "the new relative rarity of the prefab (currently unused)",
      } as SlashCommandOption<"number">,
    ],
  } as SlashCommandOption<"subcommand">);
