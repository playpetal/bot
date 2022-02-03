import { Account } from "petal";
import { Embed } from "../../struct/embed";
import { displayName } from "../util/displayName";

export function getProfileEmbed(account: Account) {
  const embed = new Embed()
    .setDescription(
      `<:user:930918872473796648> ${displayName(account)}` +
        `\nregistered <t:${Math.floor(account.createdAt / 1000)}:R>` +
        (account.bio ? `\n\n${account.bio}` : ``) +
        `\n\n<:petals:930918815225741383> **${account.currency.toLocaleString()}**` +
        `\n<:petal:917578760449060995> **${account.stats.cardCount.toLocaleString()}** cards` +
        `\n\n[[view on website]](https://playpetal.com/profile/${account.id})`
    )
    .setThumbnail("https://cdn.playpetal.com/avatars/default.png")
    .setImage("https://cdn.playpetal.com/banners/default.png");

  return embed;
}
