import { Autocomplete } from "petal";
import { searchGroups } from "../../../../../lib/graphql/query/SEARCH_GROUPS";

const autocomplete: Autocomplete = async function autocomplete({
  interaction,
  options,
}) {
  const focused = options.getFocused()!;

  const search = await searchGroups(focused.value as string);

  const choices = search.map((c) => {
    const date = c.creation
      ? new Date(c.creation).toISOString().split("T")[0]
      : "No Date";
    return { name: `${c.name} (${date})`, value: c.id.toString() };
  });

  await interaction.acknowledge(choices);
  return;
};

export default autocomplete;
