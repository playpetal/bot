import { Autocomplete } from "petal";
import { getUserTitles } from "../../../../lib/graphql/query/GET_USER_TITLES";

const autocomplete: Autocomplete = async ({ interaction, user, options }) => {
  const search = options.getOption<string>("title")!;
  const titles = await getUserTitles(user.id, search);

  const choices = titles.map(({ title: { title } }) => {
    {
      return {
        name: title.replace("%u", "<username>"),
        value: title.replace("%u", "").trim(),
      };
    }
  });

  await interaction.acknowledge(choices);
  return;
};

export default autocomplete;
