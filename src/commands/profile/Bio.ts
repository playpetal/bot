import { CONSTANTS } from "../../lib/constants";
import { setBio } from "../../lib/graphql/mutation/SET_BIO";
import { Run, SlashCommand } from "../../struct/command";
import { Embed } from "../../struct/embed";
import { BotError } from "../../struct/error";

const run: Run = async function ({ interaction, options }) {
  const bioText = options.getOption<string>("bio")!;

  if (bioText.length > 500)
    throw new BotError(
      "**woah there!**\nyour bio can only be up to 500 characters long."
    );

  await setBio(interaction.member!.id, bioText);

  const embed = new Embed().setDescription(
    `**success!**\nyour bio has been changed.`
  );

  await interaction.createMessage({ embeds: [embed] });
};

export default new SlashCommand("bio")
  .desc("change the bio displayed on your profile")
  .run(run)
  .option({
    type: CONSTANTS.OPTION_TYPE.STRING,
    name: "bio",
    description: "the text you'd like to change your bio to",
    required: true,
  });
