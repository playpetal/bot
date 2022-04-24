import { Run } from "petal";
import { searchTitles } from "../../../../lib/graphql/query/SEARCH_TITLES";

const autocomplete: Run = async function autocomplete({
  courier,
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

  await courier.send(choices);
  return;
};

export default autocomplete;
