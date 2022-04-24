import { Run } from "petal";
import { grantAllTitle } from "../../../../../../../lib/graphql/mutation/dev/GRANT_ALL_TITLE";
import { getTitle } from "../../../../../../../lib/graphql/query/GET_TITLE";
import { displayName } from "../../../../../../../lib/util/displayName";
import { Embed } from "../../../../../../../struct/embed";
import { BotError } from "../../../../../../../struct/error";

const run: Run = async function run({ courier, user, options }) {
  const titleIdStr = options.getOption<string>("title")!;

  const titleId = parseInt(titleIdStr, 10);
  const title = await getTitle({ id: titleId });

  if (!title) throw new BotError("that title doesn't exist!");

  const amount = await grantAllTitle({
    discordId: user.discordId,
    titleId: title.id,
  });

  const _user = { ...user, title };

  const embed = new Embed().setDescription(
    `**success!**\n${displayName(
      _user
    )} has been given to all (${amount}) users!`
  );

  await courier.send({ embeds: [embed] });
  return;
};

export default run;
