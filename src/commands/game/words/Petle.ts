import { WordsData } from "petal";
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
import { generateWords } from "../../../lib/minigame/words";
import { getMinigameRewardComponents } from "../../../lib/util/component/minigame";
import { emoji } from "../../../lib/util/formatting/emoji";
import { Run, SlashCommand } from "../../../struct/command";
import { Embed } from "../../../struct/embed";

const run: Run = async ({ interaction, user, options }) => {
  const subcommand = options.options[0];

  const minigame = await getMinigame(user);

  if (minigame && !isWords(minigame.data))
    throw MinigameError.AlreadyPlayingMinigame;

  const header = `${emoji.bloom} **welcome to petle!**\n**petle** is a k-pop version of the word game [Wordle](https://www.nytimes.com/games/wordle/index.html).\nyou can guess a word by using **\`/petle guess\`**! good luck!`;

  if (subcommand.name === "play") {
    if (minigame) throw MinigameError.AlreadyPlayingWords;

    const word = await getWord(user.discordId);

    const data: WordsData = {
      answer: word,
      guesses: [],
      startedAt: Date.now(),
    };

    const embed = new Embed();
    const words = generateWords(data);

    embed.setDescription(`${header}\n\n${words}`);

    const message = await interaction.editOriginalMessage({ embeds: [embed] });

    await setMinigame<"WORDS">(user, data, message.channel.id, message.id);
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

    await interaction.deleteOriginalMessage();

    data.guesses.push(guess);

    const correct = data.guesses.find((g) => g === data.answer.toLowerCase());
    const isFinished = correct || data.guesses.length >= 6;

    if (isFinished) data.elapsed = Date.now() - data.startedAt;

    await setMinigame(user, data, minigame.channel, minigame.message);

    const embed = new Embed();
    const words = generateWords(data);

    if (isFinished) {
      const correct = data.guesses.find((g) => g === data.answer.toLowerCase());

      if (correct) {
        const rewardsRemaining = await canClaimRewards(interaction.member!.id);

        let desc = `${emoji.bloom} **you got it in ${
          data.guesses.length
        } guess${data.guesses.length !== 1 ? "es" : ""} (${(
          data.elapsed! / 1000
        ).toFixed(2)}s)!**`;

        if (rewardsRemaining === 0) {
          await destroyMinigame(user);

          embed.setDescription(
            `${emoji.bloom} **petle ${data.guesses.length}/6**\n\n${words}\n\n${desc}\nyou can't claim any more rewards this hour.`
          );
        } else {
          embed.setDescription(
            `${emoji.bloom} **petle ${data.guesses.length}/6**\n\n${words}\n\n${desc}\nchoose your reward from the options below!`
          );
        }

        await interaction.editMessage(minigame.message, {
          embeds: [embed],
          components:
            rewardsRemaining > 0
              ? await getMinigameRewardComponents(
                  user.id,
                  (await canClaimPremiumRewards(interaction.member!.id)) > 0
                )
              : [],
        });

        return;
      } else {
        await destroyMinigame(user);

        embed.setDescription(
          `${emoji.bloom} **petle X/6**\n\n${words}\n\n**better luck next time!**\nthe word was **\`${data.answer}\`**!`
        );

        await interaction.editMessage(minigame.message, {
          embeds: [embed],
        });

        return;
      }
    }

    embed.setDescription(
      `${emoji.bloom} **petle ${data.guesses.length}/6**\n\n${words}`
    );
    await interaction.editMessage(minigame.message, {
      embeds: [embed],
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
  })
  .run(run);
