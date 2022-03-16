import { Autocomplete } from "petal";
import { searchTitles } from "../../../../lib/graphql/query/SEARCH_TITLES";

const autocomplete: Autocomplete = async function autocomplete({
  interaction,
  user,
  options,
}) {
  const query = options.getOption<string>("title") || "";
  const titles = await searchTitles(query);

  const choices = titles.map((t) => {
    {
      return {
        name: t.title.replace("%u", user.username),
        value: t.id.toString(),
      };
    }
  });

  return interaction.acknowledge(choices);
};

export default autocomplete;
