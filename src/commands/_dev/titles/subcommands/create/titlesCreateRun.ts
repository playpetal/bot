import { Run } from "petal";
import { createTitle } from "../../../../../lib/graphql/mutation/dev/CREATE_TITLE";
import { getTitle } from "../../../../../lib/graphql/query/GET_TITLE";
import { displayName } from "../../../../../lib/util/displayName";
import { Embed } from "../../../../../struct/embed";
import { BotError } from "../../../../../struct/error";

const run: Run = async function run({ courier, user, options }) {
  const name = options.getOption<string>("title")!;
  const desc = options.getOption<string>("description");

  if (!name.includes("%u"))
    throw new BotError(
      "the title must include `%u` as a placeholder for the username."
    );

  const titleExists = await getTitle({ title: name });
  if (titleExists) throw new BotError("that title already exists.");

  const title = await createTitle(user.discordId, name, desc);

  const _user = { ...user, title };

  const embed = new Embed().setDescription(
    `**success!**\nthe title ${displayName(_user)} has been created!`
  );
  return await courier.send({ embeds: [embed] });
};

export default run;
