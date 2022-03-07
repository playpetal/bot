import { slashCommand } from "../../lib/command";
import { CONSTANTS } from "../../lib/constants";
import { createAccount } from "../../lib/graphql/mutation/CREATE_ACCOUNT";
import { getUser } from "../../lib/graphql/query/GET_USER";
import { getUserPartial } from "../../lib/graphql/query/GET_USER_PARTIAL";
import { emoji } from "../../lib/util/formatting/emoji";
import { Run } from "../../struct/command";
import { Embed } from "../../struct/embed";
import { BotError } from "../../struct/error";

const run: Run = async function ({ interaction, options }) {
  const id = interaction.member!.id;
  const user = await getUserPartial({ discordId: id });

  if (user) throw new BotError("**woah there!**\nyou already have an account.");

  const username = options.getOption<string>("username")!;

  if (username.length > 20 || username.length < 2)
    throw new BotError(
      "**woah there!**\nyour username can only be 2-20 characters long."
    );

  if (RegExp(/[^A-Za-z0-9 _-]+/gm).exec(username))
    throw new BotError(
      "**woah there!**\nyour username contains invalid characters!\nyou may only use alphanumeric characters, spaces, hyphens, and underscores."
    );

  const userExists = await getUser({ username });

  if (userExists)
    throw new BotError(
      "**woah there!**\nsorry, but that username has already been taken."
    );

  const account = await createAccount(id, username);

  const embed = new Embed().setDescription(
    `${emoji.user} **account created!** welcome to petal, **${account.username}**!` +
      `\nfeel free to join us at https://discord.gg/petal for news and support!`
  );

  await interaction.createMessage({ embeds: [embed] });
};

export default slashCommand("register")
  .desc("sign up with this command to start playing petal!")
  .run(run)
  .option({
    type: CONSTANTS.OPTION_TYPE.STRING,
    name: "username",
    description:
      "your desired username. does not have to be your discord username!",
    required: true,
  });
