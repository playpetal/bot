import { Account } from "petal";
import { Embed } from "../../../struct/embed";
import { getSupporterTime } from "../../graphql/query/GET_SUPPORTER_TIME";
import { displayName } from "../../util/displayName";
import { hasFlag } from "../../util/flags";
import { emoji } from "../../util/formatting/emoji";
import { emphasis } from "../../util/formatting/emphasis";
import { plural } from "../../util/formatting/plural";

export async function getAccountStatsEmbed(account: Account) {
  const embed = new Embed()
    .setThumbnail("https://cdn.playpetal.com/avatars/default.png")
    .setImage("https://cdn.playpetal.com/banners/default.png");

  let desc = `${emoji.user} ${displayName(account)}\nstatistics: **account**\n`;

  const { rollCount } = account.stats;
  if (rollCount > 0)
    desc += `\n${emoji.dice} ${emphasis(rollCount)} ${plural(
      rollCount,
      "roll"
    )}`;

  if (hasFlag("PUBLIC_SUPPORTER", account.flags)) {
    const supporterTime = await getSupporterTime({ id: account.id });

    if (supporterTime)
      desc += `\n${emoji.bloom} paid for **${supporterTime}h** of server time`;
  }

  return embed.setDescription(desc);
}
