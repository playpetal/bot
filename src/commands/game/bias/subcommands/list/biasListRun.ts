import { PartialUser, Run } from "petal";
import { getBiases } from "../../../../../lib/graphql/query/game/bias/getBiases";
import { getUserPartial } from "../../../../../lib/graphql/query/GET_USER_PARTIAL";
import { displayName } from "../../../../../lib/util/displayName";
import { emoji } from "../../../../../lib/util/formatting/emoji";
import { Embed } from "../../../../../struct/embed";
import { BotError } from "../../../../../struct/error";

export const biasListRun: Run = async ({ courier, user, options }) => {
  const userId = options.getOption<string>("user");
  let target: PartialUser = user;

  if (userId) {
    const account = await getUserPartial({ discordId: userId });

    if (!account)
      throw new BotError(
        "**uh-oh!**\nthat user doesn't have a petal account yet!"
      );

    target = account;
  }

  const biases = await getBiases(target);

  const embed = new Embed();
  let desc = `${emoji.user} ${displayName(target)}'s bias list`;

  if (biases.length === 0) {
    desc += `\n${
      user.id === target.id ? "you" : "they"
    } don't have any biases set!`;

    if (user.id === target.id)
      desc += `\nyou can add to your bias list by using **/bias add**.`;
  } else {
    const girls = biases.filter((b) => b.group.gender === "FEMALE");
    const boys = biases.filter((b) => b.group.gender === "MALE");
    const coed = biases.filter((b) => b.group.gender === "COED");

    if (girls.length > 0)
      embed.addField({
        name: "girl groups",
        value: girls.map((b) => b.group.name).join(", "),
        inline: true,
      });

    if (boys.length > 0)
      embed.addField({
        name: "boy groups",
        value: boys.map((b) => b.group.name).join(", "),
        inline: true,
      });

    if (coed.length > 0)
      embed.addField({
        name: "coed groups",
        value: coed.map((b) => b.group.name).join(", "),
        inline: true,
      });
  }

  embed.setDescription(desc);
  return courier.send({ embeds: [embed] });
};
