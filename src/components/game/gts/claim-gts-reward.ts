import { GTS } from "petal";
import { claimMinigameCardReward } from "../../../lib/graphql/mutation/game/minigame/CLAIM_MINIGAME_CARD";
import { claimMinigameLilyReward } from "../../../lib/graphql/mutation/game/minigame/CLAIM_MINIGAME_LILY";
import { claimMinigamePetalReward } from "../../../lib/graphql/mutation/game/minigame/CLAIM_MINIGAME_PETAL";
import { completeGts } from "../../../lib/graphql/mutation/game/minigame/gts/COMPLETE_GTS";
import { getUser } from "../../../lib/graphql/query/GET_USER";
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

  const gameStr = await redis.get(`gts:game:${accountId}`);

  if (!gameStr) throw new BotError("this game doesn't exist!");

  const account = await getUser({ id: accountId });

  if (!account || user.id !== account.id)
    throw new BotError("that's not your game!");

  const game = JSON.parse(gameStr) as GTS;

  if (!game.correct)
    throw new BotError("you can't claim rewards for a game you didn't win!");

  let desc: string = `${emoji.song} **You got it in ${game.guesses} guess${
    game.guesses !== 1 ? "es" : ""
  } (${(game.time! / 1000).toFixed(2)}s)!**`;

  if (reward === "petal") {
    await claimMinigamePetalReward(account.discordId);

    desc += `\nYou were rewarded ${emoji.petals} **5**!`;
  } else if (reward === "card") {
    const [card] = await claimMinigameCardReward(account.discordId);

    desc += `\nYou received ${formatCard(card)}!`;
  } else if (reward === "lily") {
    await claimMinigameLilyReward(account.discordId);

    desc += `\nYou were rewarded ${emoji.lily} **1**!`;
  } else throw new BotError("there is no reward associated with the game :(");

  await redis.del(`gts:game:${accountId}`);

  await completeGts(
    account.discordId,
    game.guesses,
    game.time!,
    reward.toUpperCase() as "CARD" | "PETAL"
  );

  const embed = new Embed().setColor("#3BA55D").setDescription(desc);

  await interaction.editOriginalMessage({ embeds: [embed], components: [] });

  return;
};

const command = new Component("claim-gts-reward").run(run).autoack();

export default command;
