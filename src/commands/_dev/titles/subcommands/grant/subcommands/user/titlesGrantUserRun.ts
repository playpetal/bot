import { Run } from "petal";
import { grantTitle } from "../../../../../../../lib/graphql/mutation/dev/GRANT_TITLE";
import { getTitle } from "../../../../../../../lib/graphql/query/GET_TITLE";
import { getUser } from "../../../../../../../lib/graphql/query/GET_USER";
import { displayName } from "../../../../../../../lib/util/displayName";
import { Embed } from "../../../../../../../struct/embed";
import { BotError } from "../../../../../../../struct/error";

const run: Run = async function run({ interaction, user, options }) {
  const titleIdStr = options.getOption<string>("title")!;

  const titleId = parseInt(titleIdStr, 10);
  const title = await getTitle({ id: titleId });

  if (!title) throw new BotError("that title doesn't exist!");

  const targetId = options.getOption<string>("user")!;

  const target = await getUser({ discordId: targetId });

  if (!target) throw new BotError("that user hasn't registered yet!");

  await grantTitle({
    discordId: user.discordId,
    accountId: target.id,
    titleId: title.id,
  });

  const _target = { ...target, title: title };

  const embed = new Embed().setDescription(
    `**success!**\n${displayName(
      target
    )} has been received the title ${displayName(_target)}!`
  );

  await interaction.createMessage({ embeds: [embed] });
  return;
};

export default run;
