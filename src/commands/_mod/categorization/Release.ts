import { InteractionOption, SlashCommandOption } from "petal";
import { createRelease } from "../../../lib/graphql/mutation/categorization/release/CREATE_RELEASE";
import { updateRelease } from "../../../lib/graphql/mutation/categorization/release/UPDATE_RELEASE";
import { getRelease } from "../../../lib/graphql/query/categorization/release/GET_RELEASE";
import { Run, SlashCommand } from "../../../struct/command";
import { Embed, ErrorEmbed } from "../../../struct/embed";

const run: Run = async ({ interaction, user, options }) => {
  const subcommand = options.options[0] as InteractionOption<boolean>;

  if (subcommand.name === "edit") {
    const strReleaseId = subcommand.options![0].value as string;
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

    const droppable = subcommand.options!.find((o) => o.name === "droppable")
      ?.value as boolean | undefined;

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
    type: "subcommand",
    name: "create",
    description: "creates a release",
  } as SlashCommandOption<"subcommand">)
  .option({
    type: "subcommand",
    name: "edit",
    description: "edits a release",
    options: [
      {
        type: "integer",
        name: "release",
        description: "the release you'd like to edit",
        required: true,
      },
      {
        type: "boolean",
        name: "droppable",
        description: "if the release should be droppable",
      },
    ],
  } as SlashCommandOption<"subcommand">);
