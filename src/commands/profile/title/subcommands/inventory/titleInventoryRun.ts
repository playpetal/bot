import { Run } from "petal";
import { getUserTitles } from "../../../../../lib/graphql/query/GET_USER_TITLES";
import { displayName } from "../../../../../lib/util/displayName";
import { emoji } from "../../../../../lib/util/formatting/emoji";
import { Embed } from "../../../../../struct/embed";

const run: Run = async ({ courier, user }) => {
  const titles = await getUserTitles(user.id);

  const formatted = titles.map(
    (t) =>
      `${emoji.title} ${displayName({
        ...user,
        title: t.title,
      })}`
  );

  const embed = new Embed().setDescription(
    `viewing ${displayName(user)}'s titles *(${titles.length} owned)...*\n\n` +
      (titles.length === 0
        ? "you don't have any titles :("
        : formatted.join("\n"))
  );

  await courier.send({ embeds: [embed] });
  return;
};

export default run;
