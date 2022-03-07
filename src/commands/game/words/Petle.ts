import { WordsData } from "petal";
import { slashCommand } from "../../../lib/command";
import { CONSTANTS } from "../../../lib/constants";
import { MinigameError } from "../../../lib/error/minigame-error";
import { canClaimPremiumRewards } from "../../../lib/graphql/query/game/CAN_CLAIM_PREMIUM_REWARDS";
import { canClaimRewards } from "../../../lib/graphql/query/game/CAN_CLAIM_REWARDS";
import { getWord } from "../../../lib/graphql/query/game/GET_WORD";
import { isWordValid } from "../../../lib/graphql/query/game/minigame/words/IS_WORD_VALID";
import { logMinigame, logMissingWord } from "../../../lib/logger/minigame";
import {
  destroyMinigame,
  getMinigame,
  isWords,
  setMinigame,
} from "../../../lib/minigame";
import { getWordsEmbed } from "../../../lib/minigame/words";
import { button, row } from "../../../lib/util/component";
import { getMinigameRewardComponents } from "../../../lib/util/component/minigame";
import { Run } from "../../../struct/command";

const run: Run = async ({ interaction, user, options }) => {
  const subcommand = options.getSubcommand()!;

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

    const rewardsRemaining = await canClaimRewards(interaction.member!.id);

    const message = await interaction.editOriginalMessage({
      embeds: [getWordsEmbed(data, user, rewardsRemaining)],
      components: [
        row(
          button({
            customId: `cancel-words?${user.id}`,
            style: "red",
            label: "cancel",
          })
        ),
      ],
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

    if (isFinished) data.elapsed = Date.now() - data.startedAt;

    if ((isFinished && !correct) || (isFinished && rewardsRemaining === 0)) {
      logMinigame({ ...minigame, data });
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
  }
};

export default slashCommand("petle")
  .desc("word game")
  .option({
    type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
    name: "play",
    description: "play petle",
  })
  .option({
    type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
    name: "guess",
    description: "guess a word",
    options: [
      {
        type: CONSTANTS.OPTION_TYPE.STRING,
        name: "word",
        description: "the word you want to guess",
        required: true,
      },
    ],
    ephemeral: true,
  })
  .run(run);
