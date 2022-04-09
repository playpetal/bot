import { Run } from "petal";
import { searchCharacters } from "../../../../lib/graphql/query/categorization/character/searchCharacters";
import {
  destroyMinigame,
  getMinigame,
  setMinigame,
} from "../../../../lib/minigame";
import { Embed } from "../../../../struct/embed";

export const minigameGuessRun: Run = async ({ courier, user, options }) => {
  const activeMinigame = await getMinigame(user);

  if (!activeMinigame) {
    const embed = new Embed().setDescription(
      "**woah there!**\nyou're not playing a minigame."
    );

    await courier.send({ embeds: [embed] });

    return;
  }

  const { data } = activeMinigame;

  if (data.type === "GUESS_CHARACTER") {
    const guess = options.getOption<string>("idol");

    if (!guess) {
      const embed = new Embed().setDescription(
        "**uh-oh!**\nplease guess an idol by using **/minigame guess `idol: idol name`**!"
      );

      await courier.send({ embeds: [embed] });

      return;
    }

    const name = guess.replace(/\(\d{4}(-\d{2}){2}\)/gi, "").trim();
    const birthday = guess.match(/\d{4}(-\d{2}){2}/gi)?.[0];

    const matches = await searchCharacters({
      search: name,
      birthday: birthday ? new Date(birthday) : undefined,
    });

    if (matches.length === 0) {
      const embed = new Embed().setDescription(
        "**uh-oh!**\ni couldn't find any idols by that name.\nplease use the autocomplete options to make your choice!"
      );

      await courier.send({ embeds: [embed] });
      return;
    }

    if (matches.length > 1) {
      const embed = new Embed().setDescription(
        `**uh-oh!**\nthere are ${matches.length} idol${
          matches.length === 1 ? "" : "s"
        } matching that name!\nplease use the autocomplete options to make your choice!`
      );

      await courier.send({ embeds: [embed] });
      return;
    }

    const character = matches[0];
    data.guesses.push(character);

    if (character.id === data.answer.id) {
      const embed = new Embed().setDescription(
        `**correct!**\ni was thinking of \`${data.answer.name}\`!`
      );

      await courier.send({ embeds: [embed] });
      await destroyMinigame(user);

      return;
    }

    let birthdayStr, genderStr, lettersStr;

    if (!data.answer.birthday) {
      birthdayStr = `${
        character.birthday ? "❌" : "✅"
      } The idol has **no birthday**.`;
    } else if (character.birthday) {
      const date = new Date(character.birthday).toISOString().split("T")[0];

      if (data.answer.birthday === character.birthday) {
        birthdayStr = `✅ the idol was born **on ${date}**.`;
      } else {
        birthdayStr = `❌ the idol was born **${
          character.birthday > data.answer.birthday ? "before" : "after"
        } ${date}**.`;
      }
    } else {
      birthdayStr = "❌ the idol has **a birthday**.";
    }

    if (!data.answer.gender) {
      genderStr = `${
        character.gender ? "❌" : "✅"
      } the idol **has no gender**.`;
    } else if (!character.gender) {
      genderStr = "❌ the idol **has a gender**.";
    } else {
      if (data.answer.gender === character.gender) {
        genderStr = `✅ the idol **is ${data.answer.gender.toLowerCase()}**.`;
      } else {
        genderStr = `❌ the idol **is not ${character.gender.toLowerCase()}**.`;
      }
    }

    if (character.name.length > data.answer.name.length) {
      lettersStr = `❌ the idol has **less letters** in their name than \`${character.name}\`.`;
    } else if (character.name.length < data.answer.name.length) {
      lettersStr = `❌ the idol has **more letters** in their name than \`${character.name}\`.`;
    } else {
      lettersStr = `✅ the idol has **the same amount of letters** in their name as \`${character.name}\`.`;
    }

    const embed = new Embed().setDescription(
      `${birthdayStr}\n${genderStr}\n${lettersStr}`
    );

    await courier.send({ embeds: [embed] });

    await setMinigame(user, data, activeMinigame);
    return;
  }

  return;
};
