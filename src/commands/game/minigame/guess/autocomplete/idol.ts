import { Autocomplete } from "petal";
import { searchCharacters } from "../../../../../lib/graphql/query/categorization/character/searchCharacters";

export const minigameGuessAutocompleteIdol: Autocomplete = async ({
  interaction,
  options,
}) => {
  const focused = options.getFocused()!;
  let choices: { name: string; value: string }[] = [];

  const characters = await searchCharacters({
    search: focused.value as string,
  });

  choices = characters.map((c) => {
    const birthday = c.birthday
      ? new Date(c.birthday).toISOString().split("T")[0]
      : "No Birthday";

    const str = `${c.name} (${birthday})`;

    return { name: str, value: str };
  });

  return interaction.acknowledge(choices);
};
