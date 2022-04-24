import { Run } from "petal";
import { getUserTitles } from "../../../../lib/graphql/query/GET_USER_TITLES";

const autocomplete: Run = async ({ courier, user, options }) => {
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

  await courier.send(choices);
  return;
};

export default autocomplete;
