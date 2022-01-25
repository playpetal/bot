import Eris, {
  CommandInteraction,
  InteractionDataOptionsWithValue,
} from "eris";
import { setBio } from "../../lib/graphql/mutation/SET_BIO";
import { SlashCommand } from "../../struct/command";
import { Embed } from "../../struct/embed";

const run = async function (interaction: CommandInteraction) {
  const options = interaction.data.options as
    | InteractionDataOptionsWithValue[]
    | undefined;

  const bio = options?.find((o) => o.name === "bio")?.value as
    | string
    | undefined;

  if (bio && bio.length > 500) {
    return console.log("Too long");
  }

  await setBio(interaction.member!.id, bio);

  const embed = new Embed();

  if (!bio) {
    embed.setDescription("your bio has been **removed**.");
  } else
    embed.setDescription(`\`\`\`your bio has been changed to:\`\`\`\n${bio}`);

  await interaction.createMessage({ embeds: [embed], flags: 64 });
};

const command = new SlashCommand("bio", "change your bio", run, [
  {
    type: Eris.Constants.ApplicationCommandOptionTypes.STRING,
    name: "bio",
    description:
      "the text you'd like to change your bio to. to clear your bio, leave this blank",
  },
]);

export default command;
