import { WordsData } from "petal";
import { bot } from "../../..";
import { MinigameError } from "../../../lib/error/minigame-error";
import { canClaimPremiumRewards } from "../../../lib/graphql/query/game/CAN_CLAIM_PREMIUM_REWARDS";
import { canClaimRewards } from "../../../lib/graphql/query/game/CAN_CLAIM_REWARDS";
import { getWord } from "../../../lib/graphql/query/game/GET_WORD";
import { isWordValid } from "../../../lib/graphql/query/game/minigame/words/IS_WORD_VALID";
import {
  destroyMinigame,
  getMinigame,
  isWords,
  setMinigame,
} from "../../../lib/minigame";
import { getWordsEmbed } from "../../../lib/minigame/words";
import { getMinigameRewardComponents } from "../../../lib/util/component/minigame";
import { Run, SlashCommand } from "../../../struct/command";

const run: Run = async ({ interaction, user, options }) => {
  const subcommand = options.options[0];

  const minigame = await getMinigame(user);

  if (minigame && !isWords(minigame.data))
    throw MinigameError.AlreadyPlayingMinigame;

  if (subcommand.name === "play") {
    if (minigame)
      throw MinigameError.AlreadyPlayingWords({ ...minigame, user });

    const word = await getWord(user.discordId);

    const data: WordsData = {
      answer: word,
      guesses: [],
      startedAt: Date.now(),
    };

    const message = await interaction.editOriginalMessage({
      embeds: [getWordsEmbed(data, user, 0)],
    });

    await setMinigame<"WORDS">(user, data, {
      message: message.id,
      channel: message.channel.id,
      guild: interaction.guildID!,
    });
    return;
  }

  if (!minigame) throw MinigameError.NotPlayingWords;

  const data = minigame.data as WordsData;

  if (subcommand.name === "guess") {
    const guess = (subcommand.options![0].value as string).toLowerCase();

    if (data.guesses.length > 6) throw MinigameError.MaxWordsGuessed;

    const isValid = await isWordValid(guess);
    if (!isValid) throw MinigameError.WordNotValid;

    if (data.guesses.includes(guess)) throw MinigameError.WordAlreadyGuessed;

    await interaction.createMessage(`you guessed **${guess}**!`);

    data.guesses.push(guess);

    const correct = data.guesses.find((g) => g === data.answer.toLowerCase());
    const isFinished = correct || data.guesses.length >= 6;

    const rewardsRemaining = await canClaimRewards(interaction.member!.id);

    if (isFinished) data.elapsed = Date.now() - data.startedAt;

    if ((isFinished && !correct) || (isFinished && rewardsRemaining === 0)) {
      await destroyMinigame(user);
    } else {
      await setMinigame(user, data, minigame);
    }

    await bot.editMessage(minigame.channel, minigame.message, {
      embeds: [getWordsEmbed(data, user, rewardsRemaining)],
      components:
        correct && rewardsRemaining > 0
          ? await getMinigameRewardComponents(
              user.id,
              (await canClaimPremiumRewards(interaction.member!.id)) > 0
            )
          : [],
    });

    return;
  }
};

export default new SlashCommand("petle")
  .desc("word game")
  .option({ type: "subcommand", name: "play", description: "play petle" })
  .option({
    type: "subcommand",
    name: "guess",
    description: "guess a word",
    options: [
      {
        type: "string",
        name: "word",
        description: "the word you want to guess",
        required: true,
      },
    ],
    ephemeral: true,
  })
  .run(run);
