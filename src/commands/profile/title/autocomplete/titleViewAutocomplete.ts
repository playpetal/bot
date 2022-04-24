import { Run } from "petal";
import { searchTitles } from "../../../../lib/graphql/query/SEARCH_TITLES";

const autocomplete: Run = async ({ courier, options }) => {
  const search = options.getOption<string>("title")!;
  const titles = await searchTitles(search);

  const choices = titles.map(({ title }) => {
    {
      return {
        name: title.replace("%u", "<username>"),
        value: title.replace("%u", "").trim(),
      };
    }
  });

  await courier.send(choices);
  return;
};

export default autocomplete;
