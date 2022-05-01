import { Run } from "petal";
import { addBias } from "../../../../../lib/graphql/mutation/game/bias/addBias";
import { searchGroups } from "../../../../../lib/graphql/query/SEARCH_GROUPS";
import { emoji } from "../../../../../lib/util/formatting/emoji";
import { Embed } from "../../../../../struct/embed";
import { BotError } from "../../../../../struct/error";

export const biasAddRun: Run = async ({ courier, user, options }) => {
  const groupQuery = options.getOption<string>("group")!;

  const groups = await searchGroups(groupQuery);

  if (groups.length === 0)
    throw new BotError(
      "**uh-oh!**\nthere aren't any groups matching your input!\nplease select from the dropdown, or check your spelling!"
    );

  if (groups.length > 1)
    throw new BotError(
      `**uh-oh!**\nthere are **${groups.length} groups** matching your input!\nplease select from the dropdown, or check your spelling!`
    );

  const [group] = groups;
  const bias = await addBias(user, group);

  const embed = new Embed().setDescription(
    `${emoji.check} **${bias.group.name}** has been added to your bias list!`
  );

  return courier.send({ embeds: [embed] });
};
