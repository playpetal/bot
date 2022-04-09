import axios from "axios";
import { Maybe } from "graphql/jsutils/Maybe";
import { Run, Character, Group, Prefab, Subgroup } from "petal";
import { updatePrefab } from "../../../../../../lib/graphql/mutation/categorization/prefab/UPDATE_PREFAB";
import { getPrefab } from "../../../../../../lib/graphql/query/categorization/prefab/GET_PREFAB";
import { getLastRelease } from "../../../../../../lib/graphql/query/categorization/release/GET_LAST_RELEASE";
import { getCharacter } from "../../../../../../lib/graphql/query/categorization/character/getCharacter";
import { getGroup } from "../../../../../../lib/graphql/query/GET_GROUP";
import { getSubgroup } from "../../../../../../lib/graphql/query/GET_SUBGROUP";
import { uploadImage } from "../../../../../../lib/img";
import { ErrorEmbed, Embed } from "../../../../../../struct/embed";

const run: Run = async ({ interaction, options, user }) => {
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
        group ? `${group.name} ` : prefab!.group ? `${prefab!.group.name} ` : ""
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

export default run;
