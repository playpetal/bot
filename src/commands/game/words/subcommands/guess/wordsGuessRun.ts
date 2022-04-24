import { CommandInteraction } from "eris";
import { Run, WordsData } from "petal";
import { MinigameError } from "../../../../../lib/error/minigame-error";
import { claimMinigamePetalReward } from "../../../../../lib/graphql/mutation/game/minigame/CLAIM_MINIGAME_PETAL";
import { completeMinigame } from "../../../../../lib/graphql/mutation/game/minigame/completeMinigame";
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

const run: Run = async function run({ courier, user, options }) {
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

  await courier.send({ content: `you guessed **${guess}**!` });

  data.guesses.push(guess);

  const correct = data.guesses.find((g) => g === data.answer.toLowerCase());
  const isFinished = correct || data.guesses.length >= 6;

  const rewardsRemaining = await canClaimRewards(user.discordId);

  if (isFinished) {
    data.elapsed = Date.now() - data.startedAt;
    dd.increment(`petal.minigame.words.completed`);
  }

  const embed = getWordsEmbed(data, user, rewardsRemaining);

  if (isFinished && !correct) {
    await destroyMinigame(user);
    embed.setColor("#F04747");
  } else {
    await setMinigame(user, data, minigame);
  }

  if (isFinished && correct && rewardsRemaining <= 0) {
    await destroyMinigame(user);

    await completeMinigame(
      "WORDS",
      user.discordId,
      data.guesses.length,
      data.elapsed!,
      "PETAL"
    );
    await claimMinigamePetalReward(user.discordId);

    embed.setColor("#3BA55D");
  }

  await (courier.interaction as CommandInteraction).editMessage(
    minigame.message,
    {
      embeds: [embed],
      components:
        correct && rewardsRemaining > 0
          ? await getMinigameRewardComponents(
              user.id,
              (await canClaimPremiumRewards(user.discordId)) > 0
            )
          : !correct && data.guesses.length < 6
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
    }
  );

  return;
};

export default run;
