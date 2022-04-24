import { Run, GroupGender } from "petal";
import { updateGroup } from "../../../../../../lib/graphql/mutation/UPDATE_GROUP";
import { getGroup } from "../../../../../../lib/graphql/query/GET_GROUP";
import { Embed } from "../../../../../../struct/embed";
import { BotError } from "../../../../../../struct/error";

const run: Run = async ({ courier, user, options }) => {
  const name = options.getOption<string>("name");
  const creation = options.getOption<string>("creation");
  const gender = options.getOption<"male" | "female" | "coed">("gender");

  const strGroupId = options.getOption<string>("group")!;
  const groupId = parseInt(strGroupId, 10);

  if (isNaN(groupId))
    throw new BotError("**uh-oh!**\nplease select a group from the dropdown!");

  const group = await getGroup(groupId);

  if (!group)
    throw new BotError("**uh-oh!**\nplease select a group from the dropdown!");

  const newGroup = await updateGroup(
    user.discordId,
    group.id,
    name,
    creation ? new Date(creation) : undefined,
    gender?.toUpperCase() as GroupGender | undefined
  );

  return courier.send({
    embeds: [
      new Embed().setDescription(
        `the group **${newGroup.name}** has been updated!\ncheck **/group info \`${newGroup.name}\`** to see the new info!`
      ),
    ],
  });
};

export default run;
