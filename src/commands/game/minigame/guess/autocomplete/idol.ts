import { Gender, Run } from "petal";
import { searchCharacters } from "../../../../../lib/graphql/query/categorization/character/searchCharacters";
import { getGuessTheIdol } from "../../../../../lib/graphql/query/game/minigame/guess-the-idol/getGuessTheIdol";

export const minigameGuessAutocompleteIdol: Run = async ({
  courier,
  options,
  user,
}) => {
  const focused = options.getFocused()!;
  let choices: { name: string; value: string }[] = [];

  const minigame = await getGuessTheIdol(user);
  let birthdayBefore: Date | undefined,
    birthdayAfter: Date | undefined,
    gender: Gender | null | undefined,
    minLetters: number | undefined,
    maxLetters: number | undefined;

  if (minigame && minigame.type === "GUESS_THE_IDOL") {
    for (let attempt of minigame.attempts) {
      if (
        attempt.nameLength === "GREATER" &&
        (!minLetters || attempt.name.length >= minLetters)
      )
        minLetters = attempt.name.length + 1;

      if (
        attempt.nameLength === "LESS" &&
        (!maxLetters || attempt.name.length <= maxLetters)
      ) {
        maxLetters = attempt.name.length - 1;
      }

      if (attempt.nameLength === "EQUAL") {
        minLetters = attempt.name.length + 1;
        maxLetters = attempt.name.length;
      }

      if (
        attempt.birthDate === "GREATER" &&
        (!birthdayAfter || attempt.birthday! < birthdayAfter)
      )
        birthdayAfter = attempt.birthday!;

      if (
        attempt.birthDate === "LESS" &&
        (!birthdayBefore || attempt.birthday! > birthdayBefore)
      )
        birthdayBefore = attempt.birthday!;

      if (attempt.isGender) gender = attempt.gender;
    }
  }

  const characters = await searchCharacters({
    search: focused.value as string,
    birthdayBefore,
    birthdayAfter,
    gender: gender,
    minLetters,
    maxLetters,
    group: minigame?.group,
  });

  choices = characters.map((c) => {
    const birthday = c.birthday
      ? new Date(c.birthday).toISOString().split("T")[0]
      : "No Birthday";

    const str = `${c.name} (${birthday})`;

    return { name: str, value: str };
  });

  return courier.send(choices);
};
