import axios from "axios";
import { ComponentInteraction } from "eris";
import { updatePrefab } from "../lib/graphql/mutation/categorization/prefab/UPDATE_PREFAB";
import { prefabCreationManager } from "../lib/mod/createCard";
import { Component } from "../struct/component";
import { Embed, ErrorEmbed } from "../struct/embed";

async function run(interaction: ComponentInteraction) {
  const instance = prefabCreationManager.getInstance(interaction.member!.user);

  if (!instance) {
    return await interaction.createFollowup({
      embeds: [new ErrorEmbed("This prefab creation instance expired.")],
      flags: 64,
    });
  }

  let id: number;
  let url: string | undefined;

  try {
    const prefab = await updatePrefab({
      id: instance.isEdit!.prefabId,
      senderId: interaction.member!.id,
      characterId: instance.characterId,
      subgroupId: instance.subgroupId,
      groupId: instance.groupId,
      rarity: instance.rarity,
      maxCards: instance.maxCards,
    });

    id = prefab.id;
  } catch (e: any) {
    console.log(e);
    return await interaction.createFollowup({
      embeds: [new ErrorEmbed("an error occurred while editing the prefab.")],
    });
  }

  if (instance.imageUrl) {
    try {
      const upload = await axios.post(`${process.env.ONI_URL}/upload`, {
        url: instance.imageUrl,
        id: id.toString(),
      });

      url = upload.data.url;
    } catch (e) {
      return await interaction.createFollowup({
        embeds: [
          new ErrorEmbed("An error occurred uploading the prefab image."),
        ],
      });
    }
  }

  prefabCreationManager.deleteInstance(interaction.member!.user);
  return await interaction.createFollowup({
    embeds: [
      new Embed().setDescription(
        "**success!**" +
          `\n${url ? `[the prefab](${url})` : "the prefab"} has been edited.`
      ),
    ],
  });
}

const command = new Component("confirm_prefab_edit", run);

export default command;
