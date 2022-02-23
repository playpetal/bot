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
    embeds: [await getStatsEmbed(account)],
    components: [
      row(
        button({
          customId: `view_profile?${account.id}`,
          style: "gray",
          label: "view profile",
        }),
        button({
          customId: `view_stats?${account.id}`,
          style: "gray",
          label: "view stats",
          disabled: true,
        })
      ),
    ],
  });

  return;
}

const command = new Component("view_stats", run);

export default command;
