import { ComponentInteraction } from "eris";
import { getProfileEmbed } from "../lib/embed/Profile";
import { getUser } from "../lib/graphql/query/GET_USER";
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
      {
        type: 1,
        components: [
          {
            label: "view profile",
            style: 2,
            custom_id: `view_profile?${account.id}`,
            type: 2,
            disabled: true,
          },
          {
            label: "view stats",
            style: 2,
            custom_id: `view_stats?${account.id}`,
            type: 2,
          },
        ],
      },
    ],
  });

  return;
}

const command = new Component("view_profile", run);

export default command;
