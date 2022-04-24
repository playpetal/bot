import { Run } from "petal";
import { getSubgroup } from "../../../../../../lib/graphql/query/GET_SUBGROUP";
import { Embed } from "../../../../../../struct/embed";
import { BotError } from "../../../../../../struct/error";

const run: Run = async ({ courier, options }) => {
  const strSubgroupId = options.getOption<string>("subgroup")!;
  const subgroupId = parseInt(strSubgroupId, 10);

  if (isNaN(subgroupId))
    throw new BotError("**uh-oh!**please select a subgroup from the dropdown!");

  const subgroup = await getSubgroup(subgroupId);

  if (!subgroup)
    throw new BotError("**uh-oh!**please select a subgroup from the dropdown!");

  const creation = subgroup.creation
    ? new Date(subgroup.creation).toLocaleString("en-us", {
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      })
    : "None";

  const embed = new Embed().setDescription(
    `**Subgroup Info**\nName: **${subgroup.name}**\nCreation: **${creation}**\nID: **${subgroup.id}**`
  );

  return courier.send({ embeds: [embed] });
};

export default run;
