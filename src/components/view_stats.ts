import { getAccountStatsEmbed } from "../lib/embed/stats/account";
import { getIdolsStatsEmbed } from "../lib/embed/stats/minigame/idols";
import { getSongsStatsEmbed } from "../lib/embed/stats/minigame/songs";
import { getUser } from "../lib/graphql/query/GET_USER";
import { getMinigameStats } from "../lib/graphql/query/profile/getMinigameStats";
import { row, button, select, selectOption } from "../lib/util/component";
import { Component, RunComponent } from "../struct/component";
import { Embed } from "../struct/embed";
import { BotError } from "../struct/error";

type StatisticsType = "account" | "idols" | "songs";

const run: RunComponent = async function ({ interaction, user }) {
  const [_customId, accountIdStr] = interaction.data.custom_id.split("?");
  if (!accountIdStr) return;

  const accountId = parseInt(accountIdStr);

  if (user.id !== accountId)
    throw new BotError("**woah there!**\nthose buttons aren't for you.");

  const account = await getUser({ id: accountId });

  if (!account) return;

  let embed: Embed = new Embed();
  let statisticsType: StatisticsType = "account";

  if (interaction.data.component_type === 3) {
    statisticsType = interaction.data.values[0] as StatisticsType;

    if (statisticsType === "account") {
      embed = await getAccountStatsEmbed(account);
    } else if (statisticsType === "idols") {
      const stats = await getMinigameStats<"GUESS_CHARACTER">(
        account.id,
        "GUESS_CHARACTER"
      );

      embed = getIdolsStatsEmbed(stats, account);
    } else if (statisticsType === "songs") {
      const stats = await getMinigameStats<"GTS">(account.id, "GTS");

      embed = getSongsStatsEmbed(stats, account);
    }
  } else {
    embed = await getAccountStatsEmbed(account);
  }

  await interaction.editOriginalMessage({
    embeds: [embed],
    components: [
      row(
        select({
          customId: `view_stats?${account.id}?`,
          options: [
            selectOption({
              label: "account stats",
              value: "account",
              description:
                "shows a variety of statistics related to your account",
              isDefault: statisticsType === "account",
            }),
            selectOption({
              label: "minigame stats (idols)",
              value: "idols",
              description:
                "shows a variety of statistics related to the idols minigame",
              isDefault: statisticsType === "idols",
            }),
            selectOption({
              label: "minigame stats (songs)",
              value: "songs",
              description:
                "shows a variety of statistics related to the songs minigame",
              isDefault: statisticsType === "songs",
            }),
          ],
        })
      ),
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
};

const command = new Component("view_stats").run(run).autoack();

export default command;
