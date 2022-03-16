import { Autocomplete } from "petal";
import { searchCharacters } from "../../../../../lib/graphql/query/SEARCH_CHARACTERS";
import { searchGroups } from "../../../../../lib/graphql/query/SEARCH_GROUPS";
import { searchPrefabs } from "../../../../../lib/graphql/query/SEARCH_PREFABS";
import { searchSubgroups } from "../../../../../lib/graphql/query/SEARCH_SUBGROUPS";

const autocomplete: Autocomplete = async ({ interaction, options }) => {
  const focused = options.getFocused()!;
  let choices: { name: string; value: string }[] = [];

  const nested = focused.options!.find((o) => o.focused)!;

  if (nested.name === "prefab") {
    const search = await searchPrefabs(nested.value as string);

    choices = search.map((p) => {
      let str = p.character.name;

      if (p.group) str = `${p.group.name} ${str}`;
      if (p.subgroup) str = `${str} ${p.subgroup.name}`;

      str += ` (${p.id})`;

      return { name: str, value: p.id.toString() };
    });
  } else if (nested.name === "character") {
    const search = await searchCharacters(nested.value as string);

    choices = search.map((c) => {
      const birthday = c.birthday
        ? new Date(c.birthday).toISOString().split("T")[0]
        : "No Birthday";
      return { name: `${c.name} (${birthday})`, value: c.id.toString() };
    });
  } else if (nested.name === "subgroup") {
    const search = await searchSubgroups(nested.value as string);

    choices = search.map((c) => {
      const date = c.creation
        ? new Date(c.creation).toISOString().split("T")[0]
        : "No Date";
      return { name: `${c.name} (${date})`, value: c.id.toString() };
    });
  } else if (nested.name === "group") {
    const search = await searchGroups(nested.value as string);

    choices = search.map((c) => {
      const date = c.creation
        ? new Date(c.creation).toISOString().split("T")[0]
        : "No Date";
      return { name: `${c.name} (${date})`, value: c.id.toString() };
    });
  }

  return interaction.acknowledge(choices);
};

export default autocomplete;
