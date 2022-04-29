import { MinigameError } from "../../../../lib/error/minigame-error";
import { updateMinigameMessage } from "../../../../lib/graphql/mutation/game/minigame/updateMinigameMessage";
import { canClaimPremiumRewards } from "../../../../lib/graphql/query/game/CAN_CLAIM_PREMIUM_REWARDS";
import { canClaimRewards } from "../../../../lib/graphql/query/game/CAN_CLAIM_REWARDS";
import { getMinigame } from "../../../../lib/graphql/query/game/minigame/GET_MINIGAME";
import { getUser } from "../../../../lib/graphql/query/GET_USER";
import { getWordsEmbed } from "../../../../lib/minigame/words";
import { button, row } from "../../../../lib/util/component";
import { getMinigameRewardComponents } from "../../../../lib/util/component/minigame";
import { Component, RunComponent } from "../../../../struct/component";
import { BotError } from "../../../../struct/error";

const run: RunComponent = async function ({ interaction, user }) {
  const [_customId, accountIdStr] = interaction.data.custom_id.split("?");
  if (!accountIdStr) return;

  const accountId = parseInt(accountIdStr);
  const account = await getUser({ id: accountId });

  if (!account || user.id !== account.id)
    throw new BotError("that's not your game to bump!");

  const minigame = await getMinigame<"WORDS">(user);

  if (!minigame) throw MinigameError.NotPlayingWords;

  const { data } = minigame;

  try {
    await interaction.deleteMessage(minigame.messageId);
  } catch {}

  const correct = data.correct;
  const rewardsRemaining = await canClaimRewards(interaction.member!.id);
  const embed = getWordsEmbed(data, user, rewardsRemaining);

  const message = await interaction.editOriginalMessage({
    embeds: [embed],
    components:
      correct && rewardsRemaining > 0
        ? await getMinigameRewardComponents(
            user.id,
            (await canClaimPremiumRewards(interaction.member!.id)) > 0,
            "WORDS"
          )
        : data.attempts.count < 6
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

  await updateMinigameMessage(user, {
    messageId: message.id,
    channelId: interaction.channel.id,
    guildId: interaction.guildID!,
  });

  return;
};

const command = new Component("bump-words").run(run).autoack();

export default command;
