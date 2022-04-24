import { Run } from "petal";
import { searchGroups } from "../../../../../lib/graphql/query/SEARCH_GROUPS";

const autocomplete: Run = async ({ courier, options }) => {
  const focused = options.getFocused()!;
  let choices: { name: string; value: string }[] = [];

  const groups = await searchGroups(focused.value as string);

  choices = groups.map((g) => {
    const creation = g.creation
      ? new Date(g.creation).toISOString().split("T")[0]
      : "No Date";
    return { name: `${g.name} (${creation})`, value: g.name };
  });

  await courier.send(choices);
  return;
};

export default autocomplete;
