import { Run } from "petal";
import { searchTags } from "../../../../../lib/graphql/query/SEARCH_TAGS";

const autocomplete: Run = async ({ courier, user, options }) => {
  const focused = options.getFocused()!;

  const tags = await searchTags(user.discordId, focused.value as string);

  const choices = tags.map((t) => {
    return { name: t.tag, value: t.tag };
  });

  return courier.send(choices);
};

export default autocomplete;
