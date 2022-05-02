import { Run } from "petal";
import { toggleMinigamesUseBiasList } from "../../../lib/graphql/mutation/settings/TOGGLE_MINIGAMES_USE_BIAS_LIST";
import { togglePublicSupporter } from "../../../lib/graphql/mutation/settings/TOGGLE_PUBLIC_SUPPORTER";
import { FLAGS } from "../../../lib/util/flags";
import { Embed } from "../../../struct/embed";

const run: Run = async function ({ courier, user, options }) {
  const group = options.getSubcommandGroup()!;
  const subcommand = options.getSubcommand()!;

  if (group.name === "toggle") {
    if (subcommand.name === "public-supporter") {
      const { flags } = await togglePublicSupporter(user.discordId);

      const embed = new Embed().setDescription(
        `**success!**\nyou have **opted ${
          flags & (1 << FLAGS.PUBLIC_SUPPORTER) ? "in** to" : "out** of"
        } being a public supporter!`
      );

      await courier.send({ embeds: [embed] });
      return;
    } else if (subcommand.name === "minigames-use-bias-list") {
      const { flags } = await toggleMinigamesUseBiasList(user.discordId);

      const embed = new Embed().setDescription(
        `**success!**\nyou have **${
          flags & (1 << FLAGS.MINIGAMES_USE_BIAS_LIST)
            ? "restricted"
            : "unrestricted"
        }** your minigames ${
          flags & (1 << FLAGS.MINIGAMES_USE_BIAS_LIST) ? "to" : "from"
        } your bias list!`
      );

      await courier.send({ embeds: [embed] });
      return;
    }
  }
};

export default run;
