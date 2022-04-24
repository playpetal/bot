import { Run } from "petal";
import { updateSubgroup } from "../../../../../../lib/graphql/mutation/UPDATE_SUBGROUP";
import { getSubgroup } from "../../../../../../lib/graphql/query/GET_SUBGROUP";
import { Embed } from "../../../../../../struct/embed";
import { BotError } from "../../../../../../struct/error";

const run: Run = async ({ courier, user, options }) => {
  const name = options.getOption<string>("name")!;
  const creation = options.getOption<string>("creation");

  const strSubgroupId = options.getOption<string>("subgroup")!;
  const subgroupId = parseInt(strSubgroupId, 10);

  if (isNaN(subgroupId))
    throw new BotError(
      "**uh-oh!**\nplease select a subgroup from the dropdown!"
    );

  const subgroup = await getSubgroup(subgroupId);

  if (!subgroup)
    throw new BotError(
      "**uh-oh!**\nplease select a subgroup from the dropdown!"
    );

  if (!name && creation === undefined)
    throw new BotError(
      "**uh-oh!**\nyou didn't change anything about the subgroup!"
    );

  const newSubgroup = await updateSubgroup(
    user.discordId,
    subgroup.id,
    name,
    creation ? new Date(creation) : undefined
  );

  return courier.send({
    embeds: [
      new Embed().setDescription(
        `the subgroup **${newSubgroup.name}** has been updated!\ncheck **/subgroup info \`${newSubgroup.name}\`** to see the new info!`
      ),
    ],
  });
};

export default run;
