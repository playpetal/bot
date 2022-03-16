import { Autocomplete } from "petal";
import { searchGroups } from "../../../../../lib/graphql/query/SEARCH_GROUPS";

const autocomplete: Autocomplete = async ({ interaction, options }) => {
  const focused = options.getFocused()!;
  let choices: { name: string; value: string }[] = [];

  const groups = await searchGroups(focused.value as string);

  choices = groups.map((g) => {
    const creation = g.creation
      ? new Date(g.creation).toISOString().split("T")[0]
      : "No Date";
    return { name: `${g.name} (${creation})`, value: g.name };
  });

  return interaction.acknowledge(choices);
};

export default autocomplete;
