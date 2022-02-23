import { ComponentInteraction } from "eris";
import { GTS, PartialUser } from "petal";
import { getUser } from "../lib/graphql/query/GET_USER";
import { redis } from "../lib/redis";
import { Component } from "../struct/component";
import { Embed } from "../struct/embed";
import { BotError } from "../struct/error";

async function run(interaction: ComponentInteraction, user: PartialUser) {
  const [_customId, accountIdStr] = interaction.data.custom_id.split("?");
  if (!accountIdStr) return;

  const accountId = parseInt(accountIdStr);
  const account = await getUser({ id: accountId });

  if (!account || user.id !== account.id)
    throw new BotError("that's not your game!");

  const gameStr = await redis.get(`gts:game:${accountId}`);

  if (!gameStr) throw new BotError("this game doesn't exist!");

  const game = JSON.parse(gameStr) as GTS;
  if (game.guesses > 0)
    throw new BotError("you can't cancel a game you've guessed on!");

  await redis.del(`gts:game:${accountId}`);

  const embed = new Embed()
    .setColor("#F04747")
    .setDescription("**Better luck next time!**\nYou cancelled this game.");
  await interaction.editOriginalMessage({ embeds: [embed], components: [] });

  return;
}

const command = new Component("cancel-gts", run);

export default command;
