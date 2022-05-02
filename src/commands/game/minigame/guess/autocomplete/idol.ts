import { Run } from "petal";
import { getGuessTheIdol } from "../../../../../lib/graphql/query/game/minigame/guess-the-idol/getGuessTheIdol";
import { getGuessTheIdolAnswers } from "../../../../../lib/graphql/query/game/minigame/guess-the-idol/getGuessTheIdolAnswers";

export const minigameGuessAutocompleteIdol: Run = async ({
  courier,
  options,
  user,
}) => {
  const focused = options.getFocused()!;
  let choices: { name: string; value: string }[] = [];

  const minigame = await getGuessTheIdol(user);

  if (minigame && minigame.type === "GUESS_THE_IDOL") {
    const characters = await getGuessTheIdolAnswers(
      user,
      focused.value as string
    );

    choices = characters.map((c) => {
      const birthday = c.birthday
        ? new Date(c.birthday).toISOString().split("T")[0]
        : "No Birthday";

      const str = `${c.name} (${birthday})`;

      return { name: str, value: str };
    });
  }

  return courier.send(choices);
};
