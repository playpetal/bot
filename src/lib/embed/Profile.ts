import { Account } from "petal";
import { Embed } from "../../struct/embed";
import { displayName } from "../util/displayName";
import { emoji } from "../util/formatting/emoji";
import { strong } from "../util/formatting/strong";

export function getProfileEmbed(account: Account) {
  const {
    createdAt,
    bio,
    currency,
    stats: { cardCount },
  } = account;

  const embed = new Embed()
    .setDescription(
      `${emoji.user} ${displayName(account)}` +
        `\nregistered <t:${Math.floor(createdAt / 1000)}:R>` +
        (account.bio ? `\n\n${bio}` : ``) +
        `\n\n${emoji.petals} ${strong(currency)}**` +
        `\n${emoji.bloom} ${strong(cardCount)} cards` +
        `\n\n[[view on website]](https://playpetal.com/profile/${account.id})`
    )
    .setThumbnail("https://cdn.playpetal.com/avatars/default.png")
    .setImage("https://cdn.playpetal.com/banners/default.png");

  return embed;
}
