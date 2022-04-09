import { Autocomplete } from "petal";
import { searchCharacters } from "../../../../../lib/graphql/query/categorization/character/searchCharacters";
import { getMinigame, isCharacterGuess } from "../../../../../lib/minigame";

export const minigameGuessAutocompleteIdol: Autocomplete = async ({
  interaction,
  options,
  user,
}) => {
  const focused = options.getFocused()!;
  let choices: { name: string; value: string }[] = [];

  const minigame = await getMinigame(user);
  let birthdayBefore: Date | undefined, birthdayAfter: Date | undefined;

  if (minigame && isCharacterGuess(minigame.data)) {
    console.log("A");
    if (minigame.data.guesses.length > 0) {
      console.log("B");
      const birthdays = minigame.data.guesses
        .map((c) => c.birthday)
        .filter((d) => d !== null) as Date[];

      const answer = minigame.data.answer.birthday;

      if (answer) {
        console.log("C");
        for (let birthday of birthdays) {
          if (birthday < answer) {
            console.log("D");
            if (!birthdayAfter || birthdayAfter < birthday) {
              console.log("E");
              birthdayAfter = birthday;
            }
          } else if (birthday > answer) {
            console.log("F");
            if (!birthdayBefore || birthdayBefore > birthday) {
              console.log("G");
              birthdayBefore = birthday;
            }
          }
        }
      }
    }
  }

  const characters = await searchCharacters({
    search: focused.value as string,
    birthdayBefore,
    birthdayAfter,
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
