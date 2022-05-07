import { Run } from "petal";
import { createAccount } from "../../../lib/graphql/mutation/CREATE_ACCOUNT";
import { getUser } from "../../../lib/graphql/query/GET_USER";
import { getUserPartial } from "../../../lib/graphql/query/GET_USER_PARTIAL";
import { dd } from "../../../lib/statsd";
import { linkButton, row } from "../../../lib/util/component";
import { emoji } from "../../../lib/util/formatting/emoji";
import { Embed } from "../../../struct/embed";
import { BotError } from "../../../struct/error";

const run: Run = async function ({ courier, options }) {
  const id = courier.interaction!.member!.id;
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

  dd.increment(`petal.account.register`);

  const embed = new Embed().setDescription(
    `${emoji.user} **account created!** welcome to petal, **${account.username}**!` +
      `\npetal is a free-to-win card collecting game for k-pop fans.` +
      `\n\n${emoji.cards} **getting started**` +
      `\nyou can earn your first cards by playing minigames like **/trivia**!` +
      `\nonce you get some money, you can **/roll** to get more cards!` +
      `\nyou can view your **/inventory** and **/profile** to track your progress.` +
      `\n\n${emoji.bloom} **growing beyond**` +
      `\nif you need help or want to know something, check out **/help**!` +
      `\nyou can also join the community/support server with the button below.`
  );

  await courier.send({
    embeds: [embed],
    components: [
      row(
        linkButton({
          label: "join the server!",
          url: "https://discord.gg/petal",
        })
      ),
    ],
  });
};

export default run;
