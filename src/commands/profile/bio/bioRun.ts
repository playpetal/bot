import { Run } from "petal";
import { setBio } from "../../../lib/graphql/mutation/SET_BIO";
import { Embed } from "../../../struct/embed";
import { BotError } from "../../../struct/error";

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

export default run;
