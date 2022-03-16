import { Run } from "petal";
import { updateRelease } from "../../../../../../lib/graphql/mutation/categorization/release/UPDATE_RELEASE";
import { getRelease } from "../../../../../../lib/graphql/query/categorization/release/GET_RELEASE";
import { ErrorEmbed, Embed } from "../../../../../../struct/embed";

const run: Run = async ({ interaction, user, options }) => {
  const strReleaseId = options.getOption<string>("release")!;
  const releaseId = parseInt(strReleaseId, 10);

  if (isNaN(releaseId)) {
    return await interaction.createMessage({
      embeds: [new ErrorEmbed("please enter a valid release!")],
    });
  }

  const release = await getRelease(releaseId, user.discordId);

  if (!release) {
    return await interaction.createMessage({
      embeds: [new ErrorEmbed("that release was not found :(")],
    });
  }

  const droppable = options.getOption<boolean>("droppable");

  const newRelease = await updateRelease(user, release.id, droppable);

  const embed = new Embed().setDescription(
    `release **${release.id}** is now **${
      newRelease.droppable ? "droppable" : "undroppable"
    }**!`
  );

  return interaction.createMessage({ embeds: [embed] });
};

export default run;
