import axios from "axios";
import { Maybe } from "graphql/jsutils/Maybe";
import { Run, Character, Group, Prefab, Subgroup } from "petal";
import { createPrefab } from "../../../../../../lib/graphql/mutation/CREATE_PREFAB";
import { getLastRelease } from "../../../../../../lib/graphql/query/categorization/release/GET_LAST_RELEASE";
import { getCharacter } from "../../../../../../lib/graphql/query/categorization/character/getCharacter";
import { getGroup } from "../../../../../../lib/graphql/query/GET_GROUP";
import { getSubgroup } from "../../../../../../lib/graphql/query/GET_SUBGROUP";
import { uploadImage } from "../../../../../../lib/img";
import { ErrorEmbed, Embed } from "../../../../../../struct/embed";

const run: Run = async ({ interaction, options, user }) => {
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

  if (!releaseId) {
    const lastRelease = await getLastRelease();
    if (lastRelease) releaseId = lastRelease.id;
  }

  const embed = new Embed();
  let card: Buffer | undefined;

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
