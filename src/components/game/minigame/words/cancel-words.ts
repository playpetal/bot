import { bot } from "../../../..";
import { getUser } from "../../../../lib/graphql/query/GET_USER";
import { destroyMinigame, getMinigame } from "../../../../lib/minigame";
import { Component, RunComponent } from "../../../../struct/component";
import { Embed } from "../../../../struct/embed";
import { BotError } from "../../../../struct/error";

const run: RunComponent = async function ({ interaction, user }) {
  const [_customId, accountIdStr] = interaction.data.custom_id.split("?");
  if (!accountIdStr) return;

  const accountId = parseInt(accountIdStr);
  const account = await getUser({ id: accountId });

  if (!account || user.id !== account.id)
    throw new BotError("that's not your game!");

  const game = await getMinigame<"WORDS">(user);

  if (!game) throw new BotError("this game doesn't exist!");

  await destroyMinigame(user);

  const embed = new Embed()
    .setColor("#F04747")
    .setDescription("**better luck next time!**\nyou cancelled this game.");

  try {
    await bot.editMessage(game.channel, game.message, {
      embeds: [embed],
      components: [],
    });
    await interaction.deleteOriginalMessage();
  } catch {}

  return;
};

const command = new Component("cancel-words").run(run).autoack();

export default command;
