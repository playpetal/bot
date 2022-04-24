import { Run } from "petal";
import { searchTags } from "../../../../../lib/graphql/query/SEARCH_TAGS";

const autocomplete: Run = async ({ courier, user, options }) => {
  const focused = options.getFocused()!;

  const tags = await searchTags(user.discordId, focused.value as string);

  const choices = tags.map((t) => ({
    name: t.tag,
    value: t.tag,
  }));

  await courier.send(choices);
  return;
};

export default autocomplete;
