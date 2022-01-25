import axios from "axios";
import { ComponentInteraction } from "eris";
import { createPrefab } from "../lib/graphql/mutation/CREATE_PREFAB";
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
  let url: string;

  try {
    const prefab = await createPrefab(interaction.member!.id, instance);

    id = prefab.id;
    console.log(`ID: ${id}`);
  } catch (e) {
    console.log(e);
    return await interaction.createFollowup({
      embeds: [new ErrorEmbed("An error occurred creating the prefab.")],
    });
  }

  try {
    const upload = await axios.post(`${process.env.ONI_URL}/upload`, {
      url: instance.imageUrl,
      id: id.toString(),
    });

    console.log(upload.data);
    url = upload.data.url;
  } catch (e) {
    return await interaction.createFollowup({
      embeds: [new ErrorEmbed("An error occurred uploading the prefab image.")],
    });
  }

  prefabCreationManager.deleteInstance(interaction.member!.user);
  return await interaction.createFollowup({
    embeds: [
      new Embed().setDescription(
        "**Success!**" + `\nYou've created [**Prefab #${id}**](${url})!`
      ),
    ],
  });
}

const command = new Component("confirm_prefab_creation", run);

export default command;
