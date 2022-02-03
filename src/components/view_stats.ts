import { ComponentInteraction } from "eris";
import { getStatsEmbed } from "../lib/embed/Stats";
import { getUser } from "../lib/graphql/query/GET_USER";
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
      {
        type: 1,
        components: [
          {
            label: "view profile",
            style: 2,
            custom_id: `view_profile?${account.id}`,
            type: 2,
          },
          {
            label: "view stats",
            style: 2,
            custom_id: `view_stats?${account.id}`,
            type: 2,
            disabled: true,
          },
        ],
      },
    ],
  });

  return;
}

const command = new Component("view_stats", run);

export default command;
