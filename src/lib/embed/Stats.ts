import { Account } from "petal";
import { Embed } from "../../struct/embed";
import { getGTSStats } from "../graphql/query/GET_GTS_STATS";
import { displayName } from "../util/displayName";
import { emoji } from "../util/formatting/emoji";
import { strong } from "../util/formatting/strong";

export async function getStatsEmbed(account: Account) {
  const embed = new Embed()
    .setDescription(
      `${emoji.user} ${displayName(account)}` +
        `\nregistered <t:${Math.floor(account.createdAt / 1000)}:R>\n\u200b`
    )
    .setThumbnail("https://cdn.playpetal.com/avatars/default.png")
    .setImage("https://cdn.playpetal.com/banners/default.png");

  let accountStats = "";

  const { rollCount } = account.stats;

  if (rollCount > 0) {
    accountStats = `${emoji.dice} rolled ${strong(rollCount)} times`;
  }

  let gtsStats = "";

  const gts = await getGTSStats(account.id);

  if (gts) {
    const totalGames = gts.totalGames;

    if (totalGames > 0) {
      gtsStats += `${emoji.song} ${strong(totalGames)} games played`;
    }

    const totalGuesses = gts.totalGuesses;

    if (totalGuesses > 0) {
      gtsStats += `\n${emoji.song} ${strong(totalGuesses)} total guesses`;
    }

    const totalTime = gts.totalTime;

    if (totalTime > 0) {
      const totalGuessTime = (totalTime / 1000).toFixed(2);
      const _avgGuessTime = totalTime / totalGames / 1000;
      const avgGuessTime = isNaN(_avgGuessTime)
        ? `0.00`
        : _avgGuessTime.toFixed(2);

      gtsStats += `\n${emoji.song} **${totalGuessTime}s** spent guessing`;
      gtsStats += `\n${emoji.song} **${avgGuessTime}s** avg. guess time`;
    }

    const gtsPetals = gts.totalCurrency || 0;

    if (gtsPetals > 0) {
      gtsStats += `\n${emoji.song} earned ${emoji.petals} **${strong(
        gtsPetals
      )}**`;
    }

    const gtsCards = gts.totalCards || 0;

    if (gtsCards > 0) {
      gtsStats += `\n${emoji.song} earned ${emoji.cards} **${strong(
        gtsCards
      )}**`;
    }

    const gtsLilies = gts.totalPremiumCurrency;

    if (gtsLilies > 0) {
      gtsStats += `\n${emoji.song} earned ${emoji.lily} **${strong(
        gtsLilies
      )}**`;
    }
  }

  if (accountStats)
    embed.addField({
      name: "account",
      value: accountStats,
      inline: true,
    });

  if (gtsStats)
    embed.addField({
      name: "songs",
      value: gtsStats,
      inline: true,
    });

  return embed;
}
