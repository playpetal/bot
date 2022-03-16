import { Autocomplete } from "petal";
import { searchSubgroups } from "../../../../../lib/graphql/query/SEARCH_SUBGROUPS";

const autocomplete: Autocomplete = async ({ interaction, options }) => {
  const focused = options.getFocused()!;
  let choices: { name: string; value: string }[] = [];
  const nested = focused.options!.find((o) => o.focused)!;

  if (nested.name === "subgroup") {
    const subgroups = await searchSubgroups(nested.value as string);

    choices = subgroups.map((s) => {
      const creation = s.creation
        ? new Date(s.creation).toISOString().split("T")[0]
        : "No Date";
      return { name: `${s.name} (${creation})`, value: s.id.toString() };
    });
  }

  return interaction.acknowledge(choices);
};

export default autocomplete;
