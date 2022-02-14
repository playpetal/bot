import { ComponentInteraction } from "eris";
import { getProfileEmbed } from "../lib/embed/Profile";
import { getUser } from "../lib/graphql/query/GET_USER";
import { button, row } from "../lib/util/component";
import { Component } from "../struct/component";

async function run(interaction: ComponentInteraction) {
  const [_customId, accountIdStr] = interaction.data.custom_id.split("?");
  if (!accountIdStr) return;

  const accountId = parseInt(accountIdStr);
  const account = await getUser({ id: accountId });

  if (!account) return;

  await interaction.editOriginalMessage({
    embeds: [getProfileEmbed(account)],
    components: [
      row(
        button("view profile", `view_profile?${account.id}`, "gray", true),
        button("view stats", `view_stats?${account.id}`, "gray")
      ),
    ],
  });

  return;
}

const command = new Component("view_profile", run);

export default command;
