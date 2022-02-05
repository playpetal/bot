import axios from "axios";
import { ComponentInteraction } from "eris";
import { updatePrefab } from "../lib/graphql/mutation/categorization/prefab/UPDATE_PREFAB";
import { prefabCreationManager } from "../lib/mod/createCard";
import { Component } from "../struct/component";
import { Embed } from "../struct/embed";
import { BotError } from "../struct/error";

async function run(interaction: ComponentInteraction) {
  const instance = prefabCreationManager.getInstance(interaction.member!.user);

  if (!instance) throw new BotError("this instance has expired 😔");

  const { id } = await updatePrefab({
    id: instance.isEdit!.prefabId,
    senderId: interaction.member!.id,
    characterId: instance.characterId,
    subgroupId: instance.subgroupId,
    groupId: instance.groupId,
    rarity: instance.rarity,
    maxCards: instance.maxCards,
  });

  let url: string | undefined;
  if (instance.imageUrl) {
    const upload = await axios.post(`${process.env.ONI_URL}/upload`, {
      url: instance.imageUrl,
      id: id.toString(),
    });

    url = upload.data.url;
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
