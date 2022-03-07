import { Account } from "petal";
import { CONSTANTS } from "../../lib/constants";
import { getProfileEmbed } from "../../lib/embed/Profile";
import { getUser } from "../../lib/graphql/query/GET_USER";
import { button, row } from "../../lib/util/component";
import { Run, SlashCommand } from "../../struct/command";
import { BotError } from "../../struct/error";

const run: Run = async function ({ interaction, user, options }) {
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

  await interaction.createMessage({
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

export default new SlashCommand("profile")
  .desc("view someone's profile")
  .run(run)
  .option({
    type: CONSTANTS.OPTION_TYPE.USER,
    name: "user",
    description: "the user whose profile you'd like to view",
  });
