import { Run } from "petal";
import { toggleFlag } from "../../../lib/graphql/mutation/settings/TOGGLE_FLAG";
import { getUser } from "../../../lib/graphql/query/GET_USER";
import { displayName } from "../../../lib/util/displayName";
import { FLAGS, hasFlag } from "../../../lib/util/flags";
import { Embed } from "../../../struct/embed";
import { BotError } from "../../../struct/error";

export const flagRun: Run = async ({ courier, user, options }) => {
  const target = options.getOption<string>("user")!;
  const flag = options.getOption<string>("flag")! as keyof typeof FLAGS;

  if (!hasFlag("DEVELOPER", user.flags))
    throw new BotError(
      "**woah there!**\nyou don't have permission to do that."
    );

  const targetAccount = await getUser({ discordId: target });

  if (!targetAccount)
    throw new BotError("**woah there!**\nthat user doesn't have an account.");

  const account = await toggleFlag(user.discordId, targetAccount.id, flag);

  const embed = new Embed().setDescription(
    `**success!**\n\`${flag}\` has been set to \`${
      hasFlag(flag, account.flags) ? "TRUE" : "FALSE"
    }\` for ${displayName(account)}.`
  );

  await courier.send({ embeds: [embed] });
};
