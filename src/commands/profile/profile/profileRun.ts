import { Run, Account } from "petal";
import { getProfileEmbed } from "../../../lib/embed/Profile";
import { getUser } from "../../../lib/graphql/query/GET_USER";
import { row, button } from "../../../lib/util/component";
import { BotError } from "../../../struct/error";

const run: Run = async function ({ courier, user, options }) {
  const userId = options.getOption<string>("user") || user.discordId;

  let target: Account | null;
  if (userId === user.discordId) {
    target = await getUser({ id: user.id });
  } else {
    target = await getUser({ discordId: userId });
  }

  if (!target)
    throw new BotError(
      "**uh oh!**\nthat user hasn't registered yet, or doesn't exist!"
    );

  await courier.send({
    embeds: [getProfileEmbed(target)],
    components: [
      row(
        button({
          customId: `view_profile?${target.id}`,
          style: "gray",
          label: "view profile",
          disabled: true,
        }),
        button({
          customId: `view_stats?${target.id}`,
          style: "gray",
          label: "view stats",
        })
      ),
    ],
  });
};

export default run;
