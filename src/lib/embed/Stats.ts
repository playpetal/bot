import { Account } from "petal";
import { Embed } from "../../struct/embed";
import { displayName } from "../util/displayName";

export function getStatsEmbed(account: Account) {
  const embed = new Embed()
    .setDescription(
      `<:user:930918872473796648> ${displayName(account)}` +
        `\nregistered <t:${Math.floor(account.createdAt / 1000)}:R>\n\u200b`
    )
    .addField({
      name: "gameplay",
      value:
        `<:dice:938013692593860639> rolled **${account.stats.rollCount.toLocaleString()}** times` +
        `\n<:song:930932998138900540> guessed **${account.stats.gtsTotalGames.toLocaleString()}** songs`,
      inline: true,
    })
    .addField({
      name: "songs",
      value:
        `<:song:930932998138900540> **${account.stats.gtsGuessCount.toLocaleString()}** total guesses` +
        `\n<:song:930932998138900540> **${(
          account.stats.gtsTotalTime / 1000
        ).toFixed(2)}**s spent guessing` +
        `\n<:song:930932998138900540> average guess time: **${(
          account.stats.gtsTotalTime /
          account.stats.gtsTotalGames /
          1000
        ).toFixed(2)}s**` +
        `\n<:song:930932998138900540> earned <:petals:930918815225741383> **${account.stats.gtsTotalRewards.toLocaleString()}**`,
      inline: true,
    })
    .setThumbnail("https://cdn.playpetal.com/avatars/default.png")
    .setImage("https://cdn.playpetal.com/banners/default.png");

  return embed;
}
