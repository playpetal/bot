import { MinigameError } from "../../../lib/error/minigame-error";
import { claimMinigameCardReward } from "../../../lib/graphql/mutation/game/minigame/CLAIM_MINIGAME_CARD";
import { claimMinigameLilyReward } from "../../../lib/graphql/mutation/game/minigame/CLAIM_MINIGAME_LILY";
import { claimMinigamePetalReward } from "../../../lib/graphql/mutation/game/minigame/CLAIM_MINIGAME_PETAL";
import { completeGts } from "../../../lib/graphql/mutation/game/minigame/gts/COMPLETE_GTS";
import { completeWords } from "../../../lib/graphql/mutation/game/minigame/words/COMPLETE_WORDS";
import { getCardImage } from "../../../lib/img";
import { logMinigame } from "../../../lib/logger/minigame";
import { destroyMinigame, getMinigame } from "../../../lib/minigame";
import { generateWords } from "../../../lib/minigame/words";
import { emoji } from "../../../lib/util/formatting/emoji";
import { formatCard } from "../../../lib/util/formatting/format";
import { Component, RunComponent } from "../../../struct/component";
import { Embed } from "../../../struct/embed";

const run: RunComponent = async function ({ interaction, user }) {
  const [_customId, options] = interaction.data.custom_id.split("?");
  if (!options) return;

  const [_accountId, reward] = options.split("&");
  const accountId = parseInt(_accountId, 10);

  if (accountId !== user.id) throw MinigameError.NotOwnerOfMinigame;

  const minigame = await getMinigame(user);

  if (!minigame) throw MinigameError.InvalidMinigame;

  const data = minigame.data;
  let isCorrect = false;

  if (data.type === "GTS") {
    const { correct } = data;
    isCorrect = correct;
  } else if (data.type === "WORDS") {
    const { guesses, answer } = data;
    isCorrect = !!guesses.find((g) => g === answer.toLowerCase());
  } else if (data.type === "GUESS_CHARACTER") {
    const { guesses, answer } = data;
    isCorrect = !!guesses.find((g) => g.id === answer.id);
  }

  await destroyMinigame(accountId);

  logMinigame(minigame);

  if (!isCorrect) throw MinigameError.InvalidMinigame;

  const embed = new Embed().setColor("#3BA55D");
  let image: Buffer | undefined;

  let desc: string = "";

  if (data.type === "GTS") {
    const { guesses, elapsed } = data;
    desc = `${emoji.song} **You got it in ${guesses} guess${
      guesses !== 1 ? "es" : ""
    } (${(elapsed! / 1000).toFixed(2)}s)!**`;

    await completeGts(
      user.discordId,
      guesses,
      elapsed!,
      reward.toUpperCase() as "CARD" | "PETAL" | "LILY"
    );
  } else if (data.type === "WORDS") {
    const { guesses, elapsed } = data;

    desc = `${emoji.bloom} **petle ${guesses.length}/6**\n\n${generateWords(
      data
    )}\n\n${emoji.bloom} **you got it in ${guesses.length} guess${
      guesses.length !== 1 ? "es" : ""
    } (${(elapsed! / 1000).toFixed(2)}s)!**`;

    await completeWords(
      user.discordId,
      guesses.length,
      elapsed!,
      reward.toUpperCase() as "CARD" | "PETAL" | "LILY"
    );
  } else if (data.type === "GUESS_CHARACTER") {
    const { guesses, elapsed } = data;

    desc = `${emoji.bloom} ${guesses} ${elapsed}`;
  }

  if (reward === "petal") {
    await claimMinigamePetalReward(user.discordId);

    desc += `\nyou were rewarded ${emoji.petals} **5**!`;
  } else if (reward === "card") {
    const [card] = await claimMinigameCardReward(user.discordId);

    desc += `\nyou received ${formatCard(card)}!`;
    image = await getCardImage(card);
    embed.setThumbnail(`attachment://card.png`);
  } else if (reward === "lily") {
    await claimMinigameLilyReward(user.discordId);

    desc += `\nyou were rewarded ${emoji.lily} **1**!`;
  }

  embed.setDescription(desc);

  await interaction.editOriginalMessage(
    { embeds: [embed], components: [] },
    image ? [{ file: image, name: `card.png` }] : undefined
  );

  return;
};

const command = new Component("claim-minigame-reward").run(run).autoack();

export default command;
