import { Run } from "petal";
import { searchCards } from "../../../../../lib/graphql/query/SEARCH_CARDS";

const autocomplete: Run = async ({ courier, user, options }) => {
  const focused = options.getFocused()!;

  const cards = await searchCards(focused.value as string, user);

  const choices = cards.map((c) => ({
    name: `${c.id.toString(16)} - ${
      c.prefab.group ? `${c.prefab.group.name} ` : ""
    }${c.prefab.subgroup ? ` ${c.prefab.subgroup.name} ` : ""}${
      c.prefab.character.name
    }`,
    value: c.id.toString(16),
  }));

  await courier.send(choices);
  return;
};

export default autocomplete;
