import { getUser } from "../lib/graphql/query/GET_USER";
import { destroyMinigame, getMinigame } from "../lib/minigame";
import { Component, RunComponent } from "../struct/component";
import { Embed } from "../struct/embed";
import { BotError } from "../struct/error";

const run: RunComponent = async function ({ interaction, user }) {
  const [_customId, accountIdStr] = interaction.data.custom_id.split("?");
  if (!accountIdStr) return;

  const accountId = parseInt(accountIdStr);
  const account = await getUser({ id: accountId });

  if (!account || user.id !== account.id)
    throw new BotError("that's not your game!");

  const game = await getMinigame<"GTS">(user);

  if (!game) throw new BotError("this game doesn't exist!");

  if (game.data.guesses > 0)
    throw new BotError("you can't cancel a game you've guessed on!");

  await destroyMinigame(user);

  const embed = new Embed()
    .setColor("#F04747")
    .setDescription("**Better luck next time!**\nYou cancelled this game.");
  await interaction.editOriginalMessage({ embeds: [embed], components: [] });

  return;
};

const command = new Component("cancel-gts").run(run).autoack();

export default command;
