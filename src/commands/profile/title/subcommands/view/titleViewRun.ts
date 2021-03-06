import { Run } from "petal";
import { TitleError } from "../../../../../lib/error/title-error";
import { searchTitles } from "../../../../../lib/graphql/query/SEARCH_TITLES";
import { displayName } from "../../../../../lib/util/displayName";
import { emoji } from "../../../../../lib/util/formatting/emoji";
import { emphasis } from "../../../../../lib/util/formatting/emphasis";
import { plural } from "../../../../../lib/util/formatting/plural";
import { Embed } from "../../../../../struct/embed";

const run: Run = async ({ courier, user, options }) => {
  const titleName = options
    .getOption<string>("title")!
    .replace("<username>", "");

  const title = (await searchTitles(titleName))[0];

  if (!title) throw TitleError.TitleNotFound;

  const embed = new Embed().setDescription(
    `${emoji.title} ${displayName({
      ...user,
      title: { title: title.title },
    })}` +
      `\n${emoji.user} *owned by ${emphasis(
        plural(title.ownedCount, "player")
      )}*` +
      `\n\n${title.description || "this title has no description!"}`
  );

  await courier.send({ embeds: [embed] });
  return;
};

export default run;
