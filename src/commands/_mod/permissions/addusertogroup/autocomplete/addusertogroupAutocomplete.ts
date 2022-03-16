import { Autocomplete } from "petal";
import { getUserGroups } from "../../../../../lib/graphql/query/GET_USER_GROUPS";

const autocomplete: Autocomplete = async ({ interaction }) => {
  const options = interaction.data.options as {
    value: string;
    type: 3;
    name: string;
    focused?: boolean;
  }[];

  const focused = options.find((o) => o.focused)!;
  const groups = await getUserGroups(undefined, focused.value);

  const choices = groups.map((g) => {
    return { name: g.name, value: g.name };
  });

  await interaction.acknowledge(choices);
};

export default autocomplete;
