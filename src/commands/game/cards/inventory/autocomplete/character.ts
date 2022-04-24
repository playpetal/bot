import { Run } from "petal";
import { searchCharacters } from "../../../../../lib/graphql/query/categorization/character/searchCharacters";

const autocomplete: Run = async ({ courier, options }) => {
  const focused = options.getFocused()!;
  let choices: { name: string; value: string }[] = [];

  const characters = await searchCharacters({
    search: focused.value as string,
  });

  choices = characters.map((c) => {
    const birthday = c.birthday
      ? new Date(c.birthday).toISOString().split("T")[0]
      : "No Birthday";
    return { name: `${c.name} (${birthday})`, value: c.name };
  });

  await courier.send(choices);
  return;
};

export default autocomplete;
