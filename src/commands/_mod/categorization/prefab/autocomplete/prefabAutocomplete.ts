import { Autocomplete } from "petal";
import { searchCharacters } from "../../../../../lib/graphql/query/SEARCH_CHARACTERS";
import { searchGroups } from "../../../../../lib/graphql/query/SEARCH_GROUPS";
import { searchPrefabs } from "../../../../../lib/graphql/query/SEARCH_PREFABS";
import { searchSubgroups } from "../../../../../lib/graphql/query/SEARCH_SUBGROUPS";

const autocomplete: Autocomplete = async ({ interaction, options }) => {
  const focused = options.getFocused()!;
  let choices: { name: string; value: string }[] = [];

  if (focused.name === "prefab") {
    const search = await searchPrefabs(focused.value as string);

    choices = search.map((p) => {
      let str = p.character.name;

      if (p.group) str = `${p.group.name} ${str}`;
      if (p.subgroup) str = `${str} ${p.subgroup.name}`;

      str += ` (${p.id})`;

      return { name: str, value: p.id.toString() };
    });
  } else if (focused.name === "character") {
    const search = await searchCharacters(focused.value as string);

    choices = search.map((c) => {
      const birthday = c.birthday
        ? new Date(c.birthday).toISOString().split("T")[0]
        : "No Birthday";
      return { name: `${c.name} (${birthday})`, value: c.id.toString() };
    });
  } else if (focused.name === "subgroup") {
    const search = await searchSubgroups(focused.value as string);

    choices = search.map((c) => {
      const date = c.creation
        ? new Date(c.creation).toISOString().split("T")[0]
        : "No Date";
      return { name: `${c.name} (${date})`, value: c.id.toString() };
    });
  } else if (focused.name === "group") {
    const search = await searchGroups(focused.value as string);

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
