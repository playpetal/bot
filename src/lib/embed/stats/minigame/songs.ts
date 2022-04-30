import { Maybe, MinigameStats, PartialUser } from "petal";
import { Embed } from "../../../../struct/embed";
import { displayName } from "../../../util/displayName";
import { emoji } from "../../../util/formatting/emoji";
import { strong } from "../../../util/formatting/strong";

export function getSongsStatsEmbed(
  stats: Maybe<MinigameStats<"GUESS_THE_SONG">>,
  user: PartialUser
): Embed {
  const embed = new Embed()
    .setThumbnail("https://cdn.playpetal.com/avatars/default.png")
    .setImage("https://cdn.playpetal.com/banners/default.png");

  let desc = `${emoji.user} ${displayName(
    user
  )}\nstatistics: **minigame (songs)**`;

  if (!stats) {
    desc +=
      "\n\n**no stats here... yet!**\nuse **/song play** to start filling this out!";
  } else {
    desc +=
      `\n\n${strong(stats.totalGames)} games played` +
      `\n${strong(stats.totalAttempts)} guesses made (**${(
        stats.totalAttempts / stats.totalGames
      ).toFixed(1)}** per game)` +
      `\n**${(stats.totalTime / 1000).toFixed(2)}s** spent guessing (**${(
        stats.totalTime /
        stats.totalGames /
        1000
      ).toFixed(2)}s** per game)`;

    if (stats.totalCurrency > 0) {
      desc += `\n${emoji.petals} ${strong(stats.totalCurrency)} earned`;
    }

    if (stats.totalPremiumCurrency > 0) {
      desc += `\n${emoji.lily} ${strong(stats.totalPremiumCurrency)} earned`;
    }

    if (stats.totalCards > 0) {
      desc += `\n${emoji.cards} ${strong(stats.totalCards)} claimed`;
    }
  }

  return embed.setDescription(desc);
}
