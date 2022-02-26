import { Minigame } from "petal";
import { claimMinigameCardReward } from "../../../lib/graphql/mutation/game/minigame/CLAIM_MINIGAME_CARD";
import { claimMinigameLilyReward } from "../../../lib/graphql/mutation/game/minigame/CLAIM_MINIGAME_LILY";
import { claimMinigamePetalReward } from "../../../lib/graphql/mutation/game/minigame/CLAIM_MINIGAME_PETAL";
import { completeGts } from "../../../lib/graphql/mutation/game/minigame/gts/COMPLETE_GTS";
import { getUser } from "../../../lib/graphql/query/GET_USER";
import { getCardImage } from "../../../lib/img";
import { getMinigame } from "../../../lib/minigame";
import { redis } from "../../../lib/redis";
import { emoji } from "../../../lib/util/formatting/emoji";
import { formatCard } from "../../../lib/util/formatting/format";
import { Component, RunComponent } from "../../../struct/component";
import { Embed } from "../../../struct/embed";
import { BotError } from "../../../struct/error";

const run: RunComponent = async function ({ interaction, user }) {
  const [_customId, data] = interaction.data.custom_id.split("?");
  if (!data) return;

  const [_accountId, reward] = data.split("&");
  const accountId = parseInt(_accountId, 10);

  const minigame = await getMinigame(user);

  if (!minigame) throw new BotError("this game doesn't exist!");
  if (minigame.type !== "GTS")
    throw new BotError("that isn't the minigame you're currently playing!");

  const account = await getUser({ id: accountId });

  if (!account || user.id !== account.id)
    throw new BotError("that's not your game!");

  const gameData = (minigame as Minigame<"GTS">).data;

  if (!gameData.correct)
    throw new BotError("you can't claim rewards for a game you didn't win!");

  const embed = new Embed().setColor("#3BA55D");
  let image: Buffer | undefined;

  let desc: string = `${emoji.song} **You got it in ${gameData.guesses} guess${
    gameData.guesses !== 1 ? "es" : ""
  } (${(gameData.elapsed! / 1000).toFixed(2)}s)!**`;

  if (reward === "petal") {
    await claimMinigamePetalReward(account.discordId);

    desc += `\nYou were rewarded ${emoji.petals} **5**!`;
  } else if (reward === "card") {
    const [card] = await claimMinigameCardReward(account.discordId);

    desc += `\nYou received ${formatCard(card)}!`;
    image = await getCardImage(card);
    embed.setThumbnail(`attachment://card.png`);
  } else if (reward === "lily") {
    await claimMinigameLilyReward(account.discordId);

    desc += `\nYou were rewarded ${emoji.lily} **1**!`;
  } else throw new BotError("there is no reward associated with the game :(");

  await redis.del(`gts:game:${accountId}`);

  await completeGts(
    account.discordId,
    gameData.guesses,
    gameData.elapsed!,
    reward.toUpperCase() as "CARD" | "PETAL" | "LILY"
  );

  embed.setDescription(desc);

  await interaction.editOriginalMessage(
    { embeds: [embed], components: [] },
    image ? [{ file: image, name: `card.png` }] : undefined
  );

  return;
};

const command = new Component("claim-gts-reward").run(run).autoack();

export default command;
