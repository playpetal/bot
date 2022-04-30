import { Run } from "petal";
import { searchGroups } from "../../../../../lib/graphql/query/SEARCH_GROUPS";

export const autocompleteGroup: Run = async ({ courier, options }) => {
  const focused = options.getFocused()!;
  let choices: { name: string; value: string }[] = [];

  const groups = await searchGroups(focused.value as string);

  choices = groups.map((g) => {
    return { name: g.name, value: g.name };
  });

  await courier.send(choices);
  return;
};
