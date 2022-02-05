import { Account } from "petal";
import { getProfileEmbed } from "../../lib/embed/Profile";
import { getUser } from "../../lib/graphql/query/GET_USER";
import { Run, SlashCommand } from "../../struct/command";
import { BotError } from "../../struct/error";

const run: Run = async function ({ interaction, user, options }) {
  const userId =
    (options.getOption("user") as string | undefined) || user.discordId;

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
      {
        type: 1,
        components: [
          {
            type: 2,
            label: "view profile",
            custom_id: `view_profile?${target.id}`,
            style: 2,
            disabled: true,
          },
          {
            type: 2,
            label: "view stats",
            custom_id: `view_stats?${target.id}`,
            style: 2,
          },
        ],
      },
    ],
  });
};

export default new SlashCommand("profile")
  .desc("view someone's profile")
  .run(run)
  .option({
    type: "user",
    name: "user",
    description: "the user whose profile you'd like to view",
  });
