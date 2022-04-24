import { Run } from "petal";
import { updateRelease } from "../../../../../../lib/graphql/mutation/categorization/release/UPDATE_RELEASE";
import { getRelease } from "../../../../../../lib/graphql/query/categorization/release/GET_RELEASE";
import { Embed } from "../../../../../../struct/embed";
import { BotError } from "../../../../../../struct/error";

const run: Run = async ({ courier, user, options }) => {
  const strReleaseId = options.getOption<string>("release")!;
  const releaseId = parseInt(strReleaseId, 10);

  if (isNaN(releaseId))
    throw new BotError("**uh-oh!**\nplease enter a valid release!");

  const release = await getRelease(releaseId, user.discordId);

  if (!release) throw new BotError("**uh-oh!**\nthat release was not found :(");

  const droppable = options.getOption<boolean>("droppable");

  const newRelease = await updateRelease(user, release.id, droppable);

  const embed = new Embed().setDescription(
    `release **${release.id}** is now **${
      newRelease.droppable ? "droppable" : "undroppable"
    }**!`
  );

  return courier.send({ embeds: [embed] });
};

export default run;
