import { Autocomplete } from "petal";
import { searchCharacters } from "../../../../../lib/graphql/query/SEARCH_CHARACTERS";

const autocomplete: Autocomplete = async ({ interaction, options }) => {
  const focused = options.getFocused()!;
  let choices: { name: string; value: string }[] = [];

  const characters = await searchCharacters(focused.value as string);

  choices = characters.map((c) => {
    const birthday = c.birthday
      ? new Date(c.birthday).toISOString().split("T")[0]
      : "No Birthday";
    return { name: `${c.name} (${birthday})`, value: c.name };
  });

  return interaction.acknowledge(choices);
};

export default autocomplete;
