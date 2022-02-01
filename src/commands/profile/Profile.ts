import Eris, {
  CommandInteraction,
  InteractionDataOptionsWithValue,
} from "eris";
import { getUser } from "../../lib/graphql/query/GET_USER";
import { displayName } from "../../lib/util/displayName";
import { SlashCommand } from "../../struct/command";
import { Embed } from "../../struct/embed";

const run = async function (interaction: CommandInteraction) {
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

  const embed = new Embed()
    .setDescription(
      `<:user:930918872473796648> ${displayName(user)}` +
        `\nregistered <t:${Math.floor(user.createdAt / 1000)}:R>` +
        (user.bio ? `\n\n${user.bio}` : ``) +
        `\n\n<:petals:930918815225741383> **${user.currency.toLocaleString()}**` +
        `\n<:petal:917578760449060995> **${user.cardCount.toLocaleString()}** cards` +
        `\n\n[[view on website]](https://playpetal.com/profile/${user.id})`
    )
    .setThumbnail("https://cdn.playpetal.com/avatars/default.png")
    .setImage("https://cdn.playpetal.com/banners/default.png");

  await interaction.createMessage({
    embeds: [embed],
  });
};

const command = new SlashCommand("profile", "View someone's profile", run, [
  {
    type: Eris.Constants.ApplicationCommandOptionTypes.USER,
    name: "user",
    description:
      "The user whose profile you wish to view. To view your profile, you can leave this blank.",
  },
]);

export default command;
