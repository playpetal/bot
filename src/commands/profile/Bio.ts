import { InteractionDataOptionsWithValue } from "eris";
import { setBio } from "../../lib/graphql/mutation/SET_BIO";
import { Run, SlashCommand } from "../../struct/command";
import { Embed } from "../../struct/embed";

const run: Run = async function ({ interaction }) {
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

export default new SlashCommand("bio").desc("change your bio").run(run).option({
  type: "string",
  name: "bio",
  description: "the text you'd like to change your bio to",
  required: true,
});
