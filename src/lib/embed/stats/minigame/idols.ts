import { Maybe, MinigameStats, PartialUser } from "petal";
import { Embed } from "../../../../struct/embed";
import { displayName } from "../../../util/displayName";
import { emoji } from "../../../util/formatting/emoji";
import { emphasis } from "../../../util/formatting/emphasis";
import { pluralWord } from "../../../util/formatting/plural";

export function getIdolsStatsEmbed(
  stats: Maybe<MinigameStats<"GUESS_THE_IDOL">>,
  user: PartialUser
): Embed {
  const embed = new Embed()
    .setThumbnail("https://cdn.playpetal.com/avatars/default.png")
    .setImage("https://cdn.playpetal.com/banners/default.png");

  let desc = `${emoji.user} ${displayName(
    user
  )}\nstatistics: **minigame (idols)**`;

  if (!stats) {
    desc +=
      "\n\n**no stats here... yet!**\nuse **/minigame play `minigame: idols`** to start filling this out!";
  } else {
    desc +=
      `\n\n${emphasis(stats.totalGames)} ${pluralWord(
        stats.totalGames,
        "game"
      )} played` +
      `\n${emphasis(stats.totalAttempts)} ${pluralWord(
        stats.totalAttempts,
        "guess",
        "es"
      )} made (${emphasis(
        (stats.totalAttempts / stats.totalGames).toFixed(1)
      )} per game)` +
      `\n${emphasis(
        (stats.totalTime / 1000).toFixed(2) + "s"
      )} spent guessing (${emphasis(
        (stats.totalTime / stats.totalGames / 1000).toFixed(2) + "s"
      )} per game)`;

    if (stats.totalCurrency > 0) {
      desc += `\n${emoji.petals} ${emphasis(stats.totalCurrency)} earned`;
    }

    if (stats.totalPremiumCurrency > 0) {
      desc += `\n${emoji.lily} ${emphasis(stats.totalPremiumCurrency)} earned`;
    }

    if (stats.totalCards > 0) {
      desc += `\n${emoji.cards} ${emphasis(stats.totalCards)} claimed`;
    }
  }

  return embed.setDescription(desc);
}
