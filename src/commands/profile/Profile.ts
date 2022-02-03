import Eris, {
  CommandInteraction,
  InteractionDataOptionsWithValue,
} from "eris";
import { getProfileEmbed } from "../../lib/embed/Profile";
import { getUser } from "../../lib/graphql/query/GET_USER";
import { Run, SlashCommand } from "../../struct/command";

const run: Run = async function ({ interaction }) {
  const options = interaction.data.options as
    | InteractionDataOptionsWithValue[]
    | undefined;

  const targetId =
    (options?.find((o) => o.name === "user")?.value as string | undefined) ||
    interaction.member!.user.id;

  const user = await getUser({ discordId: targetId });

  if (!user) {
    await interaction.createMessage({ content: "no profile" });
    return;
  }

  await interaction.createMessage({
    embeds: [getProfileEmbed(user)],
    components: [
      {
        type: 1,
        components: [
          {
            type: 2,
            label: "view profile",
            custom_id: `view_profile?${user.id}`,
            style: 2,
            disabled: true,
          },
          {
            type: 2,
            label: "view stats",
            custom_id: `view_stats?${user.id}`,
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
