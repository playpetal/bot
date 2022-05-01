import { Run } from "petal";
import { getBiases } from "../../../../lib/graphql/query/game/bias/getBiases";

export const autocompleteBias: Run = async ({ courier, user, options }) => {
  const focused = options.getFocused()!;
  let choices: { name: string; value: string }[] = [];

  const biases = await getBiases(user);
  let strings = biases.map((b) => b.group.name);

  if (focused.value)
    strings = strings.filter((s) =>
      s.toLowerCase().includes((focused.value as string).toLowerCase())
    );

  choices = strings.map((s) => {
    return { name: s, value: s };
  });

  await courier.send(choices);
  return;
};
