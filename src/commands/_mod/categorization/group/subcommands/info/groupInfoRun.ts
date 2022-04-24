import { Run } from "petal";
import { getGroup } from "../../../../../../lib/graphql/query/GET_GROUP";
import { Embed } from "../../../../../../struct/embed";
import { BotError } from "../../../../../../struct/error";

const run: Run = async ({ courier, options }) => {
  const strGroupId = options.getOption<string>("group")!;
  const groupId = parseInt(strGroupId, 10);

  if (isNaN(groupId))
    throw new BotError("**uh-oh!**\nplease select a group from the dropdown!");

  const group = await getGroup(groupId);

  if (!group)
    throw new BotError("**uh-oh!**\nplease select a group from the dropdown!");

  const creation = group.creation
    ? new Date(group.creation).toLocaleString("en-us", {
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      })
    : "None";

  const embed = new Embed().setDescription(
    `**Group Info**\nName: **${
      group.name
    }**\nCreation: **${creation}**\nGender: **${
      group.gender || "None"
    }**\nAliases: **${
      group.aliases.length > 0
        ? group.aliases.map((a) => a.alias).join(", ")
        : "None"
    }**\nID: ${group.id}`
  );

  return courier.send({ embeds: [embed] });
};

export default run;
