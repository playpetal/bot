import { Run, WordsData } from "petal";
import { MinigameError } from "../../../../../lib/error/minigame-error";
import { canClaimPremiumRewards } from "../../../../../lib/graphql/query/game/CAN_CLAIM_PREMIUM_REWARDS";
import { canClaimRewards } from "../../../../../lib/graphql/query/game/CAN_CLAIM_REWARDS";
import { isWordValid } from "../../../../../lib/graphql/query/game/minigame/words/IS_WORD_VALID";
import { logMissingWord } from "../../../../../lib/logger/minigame";
import {
  destroyMinigame,
  getMinigame,
  setMinigame,
} from "../../../../../lib/minigame";
import { getWordsEmbed } from "../../../../../lib/minigame/words";
import { dd } from "../../../../../lib/statsd";
import { row, button } from "../../../../../lib/util/component";
import { getMinigameRewardComponents } from "../../../../../lib/util/component/minigame";

const run: Run = async function run({ interaction, user, options }) {
  const minigame = await getMinigame(user);

  if (!minigame) throw MinigameError.NotPlayingWords;

  const data = minigame.data as WordsData;

  const guess = options.getOption<string>("word")!.toLowerCase();

  if (data.guesses.length > 6) throw MinigameError.MaxWordsGuessed;

  const isValid = await isWordValid(guess);

  if (!isValid) {
    if (guess.length === 5) logMissingWord(guess);
    throw MinigameError.WordNotValid;
  }

  if (data.guesses.includes(guess)) throw MinigameError.WordAlreadyGuessed;

  await interaction.createMessage(`you guessed **${guess}**!`);

  data.guesses.push(guess);

  const correct = data.guesses.find((g) => g === data.answer.toLowerCase());
  const isFinished = correct || data.guesses.length >= 6;

  const rewardsRemaining = await canClaimRewards(interaction.member!.id);

  if (isFinished) {
    data.elapsed = Date.now() - data.startedAt;
    dd.increment(`petal.minigame.words.completed`);
  }

  if ((isFinished && !correct) || (isFinished && rewardsRemaining === 0)) {
    await destroyMinigame(user);
  } else {
    await setMinigame(user, data, minigame);
  }

  await interaction.editMessage(minigame.message, {
    embeds: [getWordsEmbed(data, user, rewardsRemaining)],
    components:
      correct && rewardsRemaining > 0
        ? await getMinigameRewardComponents(
            user.id,
            (await canClaimPremiumRewards(interaction.member!.id)) > 0
          )
        : data.guesses.length < 6
        ? [
            row(
              button({
                customId: `cancel-words?${user.id}`,
                style: "red",
                label: "cancel",
              })
            ),
          ]
        : [],
  });

  return;
};

export default run;
