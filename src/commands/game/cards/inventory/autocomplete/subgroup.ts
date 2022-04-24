import { Run } from "petal";
import { searchSubgroups } from "../../../../../lib/graphql/query/SEARCH_SUBGROUPS";

const autocomplete: Run = async ({ courier, options }) => {
  const focused = options.getFocused()!;
  let choices: { name: string; value: string }[] = [];

  const subgroups = await searchSubgroups(focused.value as string);

  choices = subgroups.map((s) => {
    const creation = s.creation
      ? new Date(s.creation).toISOString().split("T")[0]
      : "No Date";
    return { name: `${s.name} (${creation})`, value: s.name };
  });

  return courier.send(choices);
};

export default autocomplete;
