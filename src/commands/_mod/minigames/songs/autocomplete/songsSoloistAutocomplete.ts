import { Autocomplete } from "petal";
import { searchCharacters } from "../../../../../lib/graphql/query/SEARCH_CHARACTERS";

const autocomplete: Autocomplete = async function autocomplete({
  interaction,
  options,
}) {
  const focused = options.getFocused()!;

  const search = await searchCharacters(focused.value as string);

  const choices = search.map((c) => {
    const birthday = c.birthday
      ? new Date(c.birthday).toISOString().split("T")[0]
      : "No Birthday";
    return { name: `${c.name} (${birthday})`, value: c.id.toString() };
  });

  await interaction.acknowledge(choices);
  return;
};

export default autocomplete;
