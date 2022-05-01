import { Run } from "petal";
import { removeBias } from "../../../../../lib/graphql/mutation/game/bias/removeBias";
import { getBiases } from "../../../../../lib/graphql/query/game/bias/getBiases";
import { emoji } from "../../../../../lib/util/formatting/emoji";
import { Embed } from "../../../../../struct/embed";
import { BotError } from "../../../../../struct/error";

export const biasRemoveRun: Run = async ({ courier, user, options }) => {
  const groupQuery = options.getOption<string>("group")!;

  const biases = await getBiases(user);
  const targets = biases.filter((b) =>
    b.group.name.toLowerCase().includes(groupQuery.toLowerCase())
  );

  if (targets.length === 0)
    throw new BotError(
      "**uh-oh!**\nthere aren't any groups matching your input, or they aren't on your bias list!\nplease select from the dropdown, or check your spelling!"
    );

  if (targets.length > 1)
    throw new BotError(
      `**uh-oh!**\nthere are **${targets.length} groups** matching your input!\nplease select from the dropdown, or check your spelling!`
    );

  const [target] = targets;
  const bias = await removeBias(user, target);

  const embed = new Embed().setDescription(
    `${emoji.check} **${bias.group.name}** has been removed from your bias list!`
  );

  return courier.send({ embeds: [embed] });
};
