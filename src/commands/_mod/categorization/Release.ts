import { CONSTANTS } from "../../../lib/constants";
import { createRelease } from "../../../lib/graphql/mutation/categorization/release/CREATE_RELEASE";
import { updateRelease } from "../../../lib/graphql/mutation/categorization/release/UPDATE_RELEASE";
import { getRelease } from "../../../lib/graphql/query/categorization/release/GET_RELEASE";
import { Run, SlashCommand } from "../../../struct/command";
import { Embed, ErrorEmbed } from "../../../struct/embed";

const run: Run = async ({ interaction, user, options }) => {
  const subcommand = options.getSubcommand()!;

  if (subcommand.name === "edit") {
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
  } else if (subcommand.name === "create") {
    const release = await createRelease(user);

    const embed = new Embed().setDescription(
      `release **${release.id}** has been created!\nit's currently undroppable.`
    );

    return interaction.createMessage({ embeds: [embed] });
  }
};

export default new SlashCommand("release")
  .run(run)
  .option({
    type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
    name: "create",
    description: "creates a release",
  })
  .option({
    type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
    name: "edit",
    description: "edits a release",
    options: [
      {
        type: CONSTANTS.OPTION_TYPE.INTEGER,
        name: "release",
        description: "the release you'd like to edit",
        required: true,
      },
      {
        type: CONSTANTS.OPTION_TYPE.BOOLEAN,
        name: "droppable",
        description: "if the release should be droppable",
      },
    ],
  });
