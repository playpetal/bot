import { Run } from "petal";
import { searchGroups } from "../../../../../lib/graphql/query/SEARCH_GROUPS";

const autocomplete: Run = async function autocomplete({ courier, options }) {
  const focused = options.getFocused()!;

  const search = await searchGroups(focused.value as string);

  const choices = search.map((c) => {
    const date = c.creation
      ? new Date(c.creation).toISOString().split("T")[0]
      : "No Date";
    return { name: `${c.name} (${date})`, value: c.id.toString() };
  });

  await courier.send(choices);
  return;
};

export default autocomplete;
