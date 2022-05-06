import { Button } from "petal";
import { answerTrivia } from "../../../../lib/graphql/mutation/game/minigame/trivia/answerTrivia";
import { canClaimPremiumRewards } from "../../../../lib/graphql/query/game/CAN_CLAIM_PREMIUM_REWARDS";
import { button, row } from "../../../../lib/util/component";
import { getMinigameRewardComponents } from "../../../../lib/util/component/minigame";
import { emoji } from "../../../../lib/util/formatting/emoji";
import { Component, RunComponent } from "../../../../struct/component";
import { Embed } from "../../../../struct/embed";
import { BotError } from "../../../../struct/error";

const run: RunComponent = async function ({ interaction, user }) {
  const [_customId, data] = interaction.data.custom_id.split("?");
  const _data = data.split("&");
  const accountIdStr = _data[0];
  const answer = _data.slice(1).join("&");

  if (!accountIdStr) return;

  const accountId = parseInt(accountIdStr);

  if (user.id !== accountId) throw new BotError("that's not your game!");

  const minigame = await answerTrivia(user.discordId, answer);

  const components = (await interaction.getOriginalMessage()).components!;
  const optionOrder = components
    .map((c) => c.components.map((b) => (b as Button).label))
    .flat();

  const buttons: Button[] = [];

  for (let option of optionOrder) {
    let color: "gray" | "red" | "green";

    if (option === minigame.answer!) {
      color = "green";
    } else if (option === answer && option !== minigame.answer) {
      color = "red";
    } else color = "gray";

    buttons.push(
      button({
        customId: `trivia-answered?${user.id}&${option}`,
        disabled: true,
        label: option,
        style: color,
      })
    );
  }

  const embed = new Embed();

  if (minigame.state === "PENDING" || minigame.state === "COMPLETED") {
    embed.setColor("#3BA55D");
    if (minigame.state === "COMPLETED") {
      embed.setDescription(
        `${emoji.user} **${minigame.question}**\ncorrect! you were rewarded ${emoji.petals} **1** for playing.`
      );
    } else {
      const canClaim = await canClaimPremiumRewards(user.discordId);
      const rewardComponents = await getMinigameRewardComponents(
        user.id,
        canClaim > 0,
        "TRIVIA"
      );

      embed.setDescription(
        `${emoji.user} **${minigame.question}**\nyou correctly answered **${
          minigame.answer
        }** in **${(minigame.elapsed! / 1000).toFixed(
          2
        )}s**!\n\nselect your reward from one of the buttons!`
      );

      await interaction.editOriginalMessage({
        embeds: [embed],
        components: rewardComponents,
      });

      return;
    }
  } else {
    embed
      .setColor("#F04747")
      .setDescription(
        `${emoji.user} **${
          minigame.question
        }**\nbetter luck next time! the answer was **${minigame.answer!}**!`
      );
  }

  await interaction.editOriginalMessage({
    embeds: [embed],
    components: [row(...buttons)],
  });
  return;
};

const command = new Component("answer-trivia").run(run).autoack();

export default command;
