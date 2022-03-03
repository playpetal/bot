import { GTSData, WordsData } from "petal";
import { claimMinigameCardReward } from "../../../lib/graphql/mutation/game/minigame/CLAIM_MINIGAME_CARD";
import { claimMinigameLilyReward } from "../../../lib/graphql/mutation/game/minigame/CLAIM_MINIGAME_LILY";
import { claimMinigamePetalReward } from "../../../lib/graphql/mutation/game/minigame/CLAIM_MINIGAME_PETAL";
import { completeGts } from "../../../lib/graphql/mutation/game/minigame/gts/COMPLETE_GTS";
import { completeWords } from "../../../lib/graphql/mutation/game/minigame/words/COMPLETE_WORDS";
import { getUser } from "../../../lib/graphql/query/GET_USER";
import { getCardImage } from "../../../lib/img";
import { logMinigame } from "../../../lib/logger/minigame";
import { destroyMinigame, getMinigame } from "../../../lib/minigame";
import { generateWords } from "../../../lib/minigame/words";
import { emoji } from "../../../lib/util/formatting/emoji";
import { formatCard } from "../../../lib/util/formatting/format";
import { Component, RunComponent } from "../../../struct/component";
import { Embed } from "../../../struct/embed";
import { BotError } from "../../../struct/error";

const run: RunComponent = async function ({ interaction, user }) {
  const [_customId, options] = interaction.data.custom_id.split("?");
  if (!options) return;

  const [_accountId, reward] = options.split("&");
  const accountId = parseInt(_accountId, 10);

  const minigame = await getMinigame(user);

  if (!minigame) throw new BotError("this game doesn't exist!");

  const account = await getUser({ id: accountId });

  if (!account || user.id !== account.id)
    throw new BotError("that's not your game!");

  const data = minigame.data;
  let isCorrect = false;

  if (minigame.type === "GTS") {
    const { correct } = data as GTSData;
    isCorrect = correct;
  } else if (minigame.type === "WORDS") {
    const { guesses, answer } = data as WordsData;
    isCorrect = !!guesses.find((g) => g === answer.toLowerCase());
  }

  await destroyMinigame(accountId);

  if (!isCorrect)
    throw new BotError("you can't claim rewards for a game you didn't win!");

  logMinigame(minigame);

  const embed = new Embed().setColor("#3BA55D");
  let image: Buffer | undefined;

  let desc: string = "";

  if (minigame.type === "GTS") {
    const { guesses, elapsed } = data as GTSData;
    desc = `${emoji.song} **You got it in ${guesses} guess${
      guesses !== 1 ? "es" : ""
    } (${(elapsed! / 1000).toFixed(2)}s)!**`;

    await completeGts(
      account.discordId,
      guesses,
      elapsed!,
      reward.toUpperCase() as "CARD" | "PETAL" | "LILY"
    );
  } else if (minigame.type === "WORDS") {
    const { guesses, elapsed } = data as WordsData;

    desc = `${emoji.bloom} **petle ${guesses.length}/6**\n\n${generateWords(
      data as WordsData
    )}\n\n${emoji.bloom} **you got it in ${guesses.length} guess${
      guesses.length !== 1 ? "es" : ""
    } (${(elapsed! / 1000).toFixed(2)}s)!**`;

    await completeWords(
      account.discordId,
      guesses.length,
      elapsed!,
      reward.toUpperCase() as "CARD" | "PETAL" | "LILY"
    );
  }

  if (reward === "petal") {
    await claimMinigamePetalReward(account.discordId);

    desc += `\nyou were rewarded ${emoji.petals} **5**!`;
  } else if (reward === "card") {
    const [card] = await claimMinigameCardReward(account.discordId);

    desc += `\nyou received ${formatCard(card)}!`;
    image = await getCardImage(card);
    embed.setThumbnail(`attachment://card.png`);
  } else if (reward === "lily") {
    await claimMinigameLilyReward(account.discordId);

    desc += `\nyou were rewarded ${emoji.lily} **1**!`;
  } else throw new BotError("there is no reward associated with the game :(");

  embed.setDescription(desc);

  await interaction.editOriginalMessage(
    { embeds: [embed], components: [] },
    image ? [{ file: image, name: `card.png` }] : undefined
  );

  return;
};

const command = new Component("claim-minigame-reward").run(run).autoack();

export default command;
