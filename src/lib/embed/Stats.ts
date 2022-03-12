import { Account } from "petal";
import { Embed } from "../../struct/embed";
import { getWordsStats } from "../graphql/query/game/minigame/words/GET_WORDS_STATS";
import { getGTSStats } from "../graphql/query/GET_GTS_STATS";
import { getSupporterTime } from "../graphql/query/GET_SUPPORTER_TIME";
import { displayName } from "../util/displayName";
import { FLAGS } from "../util/flags";
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
    accountStats = `${emoji.dice} ${strong(rollCount)} rolls`;
  }

  let gtsStats = "";
  let wordsStats = "";
  let supporterStats = "";

  const gts = await getGTSStats(account.id);

  if (gts) {
    const totalGames = gts.totalGames;

    if (totalGames > 0) {
      gtsStats += `${emoji.song} ${strong(totalGames)} games`;
    }

    const totalGuesses = gts.totalGuesses;

    if (totalGuesses > 0) {
      gtsStats += `\n${emoji.song} ${strong(totalGuesses)} guesses`;
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

    const petals = gts.totalCurrency || 0;

    if (petals > 0) {
      gtsStats += `\n${emoji.song} earned ${emoji.petals} **${strong(
        petals
      )}**`;
    }

    const cards = gts.totalCards || 0;

    if (cards > 0) {
      gtsStats += `\n${emoji.song} earned ${emoji.cards} **${strong(cards)}**`;
    }

    const lilies = gts.totalPremiumCurrency;

    if (lilies > 0) {
      gtsStats += `\n${emoji.song} earned ${emoji.lily} **${strong(lilies)}**`;
    }
  }

  const words = await getWordsStats(account.id);

  if (words) {
    const totalGames = words.totalGames;

    if (totalGames > 0) {
      wordsStats += `${emoji.bloom} ${strong(totalGames)} games`;
    }

    const totalWords = words.totalWords;

    if (totalWords > 0) {
      wordsStats += `\n${emoji.bloom} ${strong(totalWords)} words`;
    }

    const totalTime = words.totalTime;

    if (totalTime > 0) {
      const totalGuessTime = (totalTime / 1000).toFixed(2);
      const _avgGuessTime = totalTime / totalGames / 1000;
      const avgGuessTime = isNaN(_avgGuessTime)
        ? `0.00`
        : _avgGuessTime.toFixed(2);

      wordsStats += `\n${emoji.bloom} **${totalGuessTime}s** spent guessing`;
      wordsStats += `\n${emoji.bloom} **${avgGuessTime}s** avg. guess time`;
    }

    const petals = words.totalCurrency || 0;

    if (petals > 0) {
      wordsStats += `\n${emoji.bloom} earned ${emoji.petals} **${strong(
        petals
      )}**`;
    }

    const cards = words.totalCards || 0;

    if (cards > 0) {
      wordsStats += `\n${emoji.bloom} earned ${emoji.cards} **${strong(
        cards
      )}**`;
    }

    const lilies = words.totalPremiumCurrency;

    if (lilies > 0) {
      wordsStats += `\n${emoji.bloom} earned ${emoji.lily} **${strong(
        lilies
      )}**`;
    }
  }

  const publicSupporter = account.flags & FLAGS.PUBLIC_SUPPORTER;

  if (publicSupporter) {
    const supporterTime = await getSupporterTime(account);

    if (supporterTime) {
      supporterStats += `\n${emoji.bloom} paid for **${supporterTime}h** of server time`;
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

  if (wordsStats)
    embed.addField({ name: "petle", value: wordsStats, inline: true });

  if (supporterStats)
    embed.addField({ name: "supporter", value: supporterStats, inline: true });

  return embed;
}
