import { Run } from "petal";
import { TitleError } from "../../../../../lib/error/title-error";
import { setUserTitle } from "../../../../../lib/graphql/mutation/SET_USER_TITLE";
import { getUserTitles } from "../../../../../lib/graphql/query/GET_USER_TITLES";
import { displayName } from "../../../../../lib/util/displayName";
import { Embed } from "../../../../../struct/embed";

const run: Run = async ({ courier, user, options }) => {
  const titleName = options
    .getOption<string>("title")!
    .replace("<username>", "");

  const title = (await getUserTitles(user.id, titleName))[0];

  if (!title) throw TitleError.TitleNotFound;

  const _user = await setUserTitle(user.discordId, title.id);

  await courier.send({
    embeds: [
      new Embed().setDescription(
        `**title updated!**\nyour title has been set to ${displayName(_user)}!`
      ),
    ],
  });
  return;
};

export default run;
