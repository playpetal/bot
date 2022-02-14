import { ComponentInteraction } from "eris";
import { getStatsEmbed } from "../lib/embed/Stats";
import { getUser } from "../lib/graphql/query/GET_USER";
import { row, button } from "../lib/util/component";
import { Component } from "../struct/component";

async function run(interaction: ComponentInteraction) {
  const [_customId, accountIdStr] = interaction.data.custom_id.split("?");
  if (!accountIdStr) return;

  const accountId = parseInt(accountIdStr);
  const account = await getUser({ id: accountId });

  if (!account) return;

  await interaction.editOriginalMessage({
    embeds: [getStatsEmbed(account)],
    components: [
      row(
        button("view profile", `view_profile?${account.id}`, "gray"),
        button("view stats", `view_stats?${account.id}`, "gray", true)
      ),
    ],
  });

  return;
}

const command = new Component("view_stats", run);

export default command;
