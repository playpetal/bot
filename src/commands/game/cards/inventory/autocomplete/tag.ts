import { Autocomplete } from "petal";
import { searchTags } from "../../../../../lib/graphql/query/SEARCH_TAGS";

const autocomplete: Autocomplete = async ({ interaction, user, options }) => {
  const focused = options.getFocused()!;

  const tags = await searchTags(user.discordId, focused.value as string);

  const choices = tags.map((t) => {
    return { name: t.tag, value: t.tag };
  });

  return interaction.acknowledge(choices);
};

export default autocomplete;
