import { Maybe, MinigameStats, PartialUser } from "petal";
import { Embed } from "../../../../struct/embed";
import { displayName } from "../../../util/displayName";
import { emoji } from "../../../util/formatting/emoji";
import { emphasis } from "../../../util/formatting/emphasis";
import { pluralWord } from "../../../util/formatting/plural";

export function getTriviaStatsEmbed(
  stats: Maybe<MinigameStats<"TRIVIA">>,
  user: PartialUser
): Embed {
  const embed = new Embed()
    .setThumbnail("https://cdn.playpetal.com/avatars/default.png")
    .setImage("https://cdn.playpetal.com/banners/default.png");

  let desc = `${emoji.user} ${displayName(
    user
  )}\nstatistics: **minigame (trivia)**`;

  if (!stats) {
    desc +=
      "\n\n**no stats here... yet!**\nuse **/trivia play** to start filling this out!";
  } else {
    desc +=
      `\n\n${emphasis(stats.totalGames)} ${pluralWord(
        stats.totalGames,
        "game"
      )} played` +
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
