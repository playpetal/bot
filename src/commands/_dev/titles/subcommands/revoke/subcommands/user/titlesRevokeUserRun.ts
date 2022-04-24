import { Run } from "petal";
import { revokeTitle } from "../../../../../../../lib/graphql/mutation/dev/REVOKE_TITLE";
import { getTitle } from "../../../../../../../lib/graphql/query/GET_TITLE";
import { getUser } from "../../../../../../../lib/graphql/query/GET_USER";
import { displayName } from "../../../../../../../lib/util/displayName";
import { Embed } from "../../../../../../../struct/embed";
import { BotError } from "../../../../../../../struct/error";

const run: Run = async function run({ courier, user, options }) {
  const titleIdStr = options.getOption<string>("title")!;

  const titleId = parseInt(titleIdStr, 10);
  const title = await getTitle({ id: titleId });

  if (!title) throw new BotError("that title doesn't exist!");

  const subcommand = options.getSubcommand()!;

  if (subcommand.name === "user") {
    const targetId = options.getOption<string>("user")!;

    const target = await getUser({ discordId: targetId });

    if (!target) throw new BotError("that user hasn't registered yet!");

    await revokeTitle({
      discordId: user.discordId,
      accountId: target.id,
      titleId: title.id,
    });

    const _target = { ...target, title: title };

    const embed = new Embed().setDescription(
      `**success!**\n${displayName(
        target
      )} no longer has the title ${displayName(_target)}!`
    );

    await courier.send({ embeds: [embed] });
    return;
  }
};

export default run;
