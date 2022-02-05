import axios from "axios";
import { ComponentInteraction } from "eris";
import { createPrefab } from "../lib/graphql/mutation/CREATE_PREFAB";
import { prefabCreationManager } from "../lib/mod/createCard";
import { Component } from "../struct/component";
import { Embed } from "../struct/embed";
import { BotError } from "../struct/error";

async function run(interaction: ComponentInteraction) {
  const instance = prefabCreationManager.getInstance(interaction.member!.user);

  if (!instance) throw new BotError("this instance has expired 😔");

  const { id } = await createPrefab(interaction.member!.id, instance);

  const upload = await axios.post(`${process.env.ONI_URL}/upload`, {
    url: instance.imageUrl,
    id: id.toString(),
  });

  const url = upload.data.url;

  prefabCreationManager.deleteInstance(interaction.member!.user);
  return interaction.createFollowup({
    embeds: [
      new Embed().setDescription(
        "**success!**" + `\nyou've created [**prefab #${id}**](${url})!`
      ),
    ],
  });
}

const command = new Component("confirm_prefab_creation", run);

export default command;
