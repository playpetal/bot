import { Account } from "petal";
import { Embed } from "../../struct/embed";
import { displayName } from "../util/displayName";
import { emoji } from "../util/formatting/emoji";
import { strong } from "../util/formatting/strong";

export function getStatsEmbed(account: Account) {
  const {
    rollCount,
    gtsTotalGames,
    gtsGuessCount,
    gtsTotalRewards,
    gtsTotalTime,
  } = account.stats;

  const totalGuessTime = (gtsTotalTime / 1000).toFixed(2);
  const _avgGuessTime = gtsTotalTime / gtsTotalGames / 1000;
  const avgGuessTime = isNaN(_avgGuessTime)
    ? `0.00s`
    : `${_avgGuessTime.toFixed(2)}s`;

  const embed = new Embed()
    .setDescription(
      `${emoji.user} ${displayName(account)}` +
        `\nregistered <t:${Math.floor(account.createdAt / 1000)}:R>\n\u200b`
    )
    .addField({
      name: "gameplay",
      value:
        `${emoji.dice} rolled ${strong(rollCount)} times` +
        `\n${emoji.song} guessed ${strong(gtsTotalGames)} songs`,
      inline: true,
    })
    .addField({
      name: "songs",
      value:
        `${emoji.song} ${strong(gtsGuessCount)} total guesses` +
        `\n${emoji.song} **${totalGuessTime}**s spent guessing` +
        `\n${emoji.song} average guess time: ${strong(avgGuessTime)}` +
        `\n${emoji.song} earned ${emoji.petals} ${strong(gtsTotalRewards)}`,
      inline: true,
    })
    .setThumbnail("https://cdn.playpetal.com/avatars/default.png")
    .setImage("https://cdn.playpetal.com/banners/default.png");

  return embed;
}
