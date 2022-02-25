import { getProfileEmbed } from "../lib/embed/Profile";
import { getUser } from "../lib/graphql/query/GET_USER";
import { button, row } from "../lib/util/component";
import { Component, RunComponent } from "../struct/component";

const run: RunComponent = async function ({ interaction }) {
  const [_customId, accountIdStr] = interaction.data.custom_id.split("?");
  if (!accountIdStr) return;

  const accountId = parseInt(accountIdStr);
  const account = await getUser({ id: accountId });

  if (!account) return;

  await interaction.editOriginalMessage({
    embeds: [getProfileEmbed(account)],
    components: [
      row(
        button({
          customId: `view_profile?${account.id}`,
          style: "gray",
          label: "view profile",
          disabled: true,
        }),
        button({
          customId: `view_stats?${account.id}`,
          style: "gray",
          label: "view stats",
        })
      ),
    ],
  });

  return;
};

const command = new Component("view_profile").run(run).autoack();

export default command;
