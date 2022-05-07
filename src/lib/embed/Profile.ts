import { Account } from "petal";
import { Embed } from "../../struct/embed";
import { displayName } from "../util/displayName";
import { emoji } from "../util/formatting/emoji";
import { emphasis } from "../util/formatting/emphasis";
import { pluralWord } from "../util/formatting/plural";

export function getProfileEmbed(account: Account) {
  const {
    createdAt,
    bio,
    currency,
    premiumCurrency,
    stats: { cardCount },
  } = account;

  const embed = new Embed()
    .setDescription(
      `${emoji.user} ${displayName(account)}` +
        `\nregistered <t:${Math.floor(createdAt / 1000)}:R>` +
        (account.bio ? `\n\n${bio}` : ``) +
        `\n\n${emoji.petals} ${emphasis(currency)}` +
        `\n${emoji.cards} ${emphasis(cardCount)} ${pluralWord(
          cardCount,
          "card"
        )}` +
        (premiumCurrency !== 0
          ? `\n${emoji.lily} ${emphasis(premiumCurrency)}`
          : "") +
        `\n\n[[view on website]](https://playpetal.com/profile/${account.id})`
    )
    .setThumbnail("https://cdn.playpetal.com/avatars/default.png")
    .setImage("https://cdn.playpetal.com/banners/default.png");

  return embed;
}
