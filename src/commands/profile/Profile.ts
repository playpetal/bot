import { Account } from "petal";
import { getProfileEmbed } from "../../lib/embed/Profile";
import { getUser } from "../../lib/graphql/query/GET_USER";
import { button, row } from "../../lib/util/component";
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
      row(
        button("view profile", `view_profile?${target.id}`, "gray", true),
        button("view stats", `view_stats?${target.id}`, "gray")
      ),
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
