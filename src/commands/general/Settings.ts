import { slashCommand } from "../../lib/command";
import { CONSTANTS } from "../../lib/constants";
import { updateFlags } from "../../lib/graphql/mutation/UPDATE_FLAGS";
import { getUser } from "../../lib/graphql/query/GET_USER";
import { FLAGS } from "../../lib/util/flags";
import { Run } from "../../struct/command";
import { Embed } from "../../struct/embed";

const run: Run = async function ({ interaction, user, options }) {
  const group = options.getSubcommandGroup()!;
  const subcommand = options.getSubcommand()!;

  if (group.name === "toggle") {
    if (subcommand.name === "public-supporter") {
      const account = (await getUser({ id: user.id }))!;

      const newFlags = (account.flags ^= FLAGS.PUBLIC_SUPPORTER);
      await updateFlags(account.discordId, newFlags);

      const embed = new Embed().setDescription(
        `**success!**\nyou have **opted ${
          newFlags & FLAGS.PUBLIC_SUPPORTER ? "in** to" : "out** of"
        } being a public supporter!`
      );

      await interaction.createMessage({ embeds: [embed] });
      return;
    }
  }
};

export default slashCommand("settings")
  .desc("you can use this command to change certain settings!")
  .option({
    type: CONSTANTS.OPTION_TYPE.SUBCOMMAND_GROUP,
    name: "toggle",
    description: "opt into or out of something",
    options: [
      {
        type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
        name: "public-supporter",
        description: "toggle your supporter statistics being shown publicly",
      },
    ],
  })
  .run(run);
