import { Autocomplete, Gender } from "petal";
import { searchCharacters } from "../../../../../lib/graphql/query/categorization/character/searchCharacters";
import { getMinigame } from "../../../../../lib/minigame";

export const minigameGuessAutocompleteIdol: Autocomplete = async ({
  interaction,
  options,
  user,
}) => {
  const focused = options.getFocused()!;
  let choices: { name: string; value: string }[] = [];

  const minigame = await getMinigame(user);
  let birthdayBefore: Date | undefined,
    birthdayAfter: Date | undefined,
    gender: Gender | null | undefined;

  if (minigame && minigame.data.type === "GUESS_CHARACTER") {
    if (minigame.data.guesses.length > 0) {
      const birthdays = minigame.data.guesses
        .map((c) => c.birthday)
        .filter((d) => d !== null) as Date[];

      const answer = minigame.data.answer.birthday;

      if (answer) {
        for (let birthday of birthdays) {
          if (birthday < answer) {
            if (!birthdayAfter || birthdayAfter < birthday) {
              birthdayAfter = birthday;
            }
          } else if (birthday > answer) {
            if (!birthdayBefore || birthdayBefore > birthday) {
              birthdayBefore = birthday;
            }
          }
        }
      }
    }

    if (minigame.data.isGendered) gender = minigame.data.answer.gender;
  }

  const characters = await searchCharacters({
    search: focused.value as string,
    birthdayBefore,
    birthdayAfter,
    gender: gender,
  });

  choices = characters.map((c) => {
    const birthday = c.birthday
      ? new Date(c.birthday).toISOString().split("T")[0]
      : "No Birthday";

    const str = `${c.name} (${birthday})`;

    return { name: str, value: str };
  });

  return interaction.acknowledge(choices);
};
