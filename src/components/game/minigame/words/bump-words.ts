import { MinigameError } from "../../../../lib/error/minigame-error";
import { canClaimPremiumRewards } from "../../../../lib/graphql/query/game/CAN_CLAIM_PREMIUM_REWARDS";
import { canClaimRewards } from "../../../../lib/graphql/query/game/CAN_CLAIM_REWARDS";
import { getUser } from "../../../../lib/graphql/query/GET_USER";
import { getMinigame, setMinigame } from "../../../../lib/minigame";
import { getWordsEmbed } from "../../../../lib/minigame/words";
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
    await interaction.deleteMessage(minigame.message);
  } catch {}

  const correct = data.guesses.find((g) => g === data.answer.toLowerCase());
  const rewardsRemaining = await canClaimRewards(interaction.member!.id);
  const embed = getWordsEmbed(data, user, rewardsRemaining);

  const message = await interaction.editOriginalMessage({
    embeds: [embed],
    components:
      correct && rewardsRemaining > 0
        ? await getMinigameRewardComponents(
            user.id,
            (await canClaimPremiumRewards(interaction.member!.id)) > 0
          )
        : [],
  });

  await setMinigame(account, minigame.data, {
    message: message.id,
    channel: interaction.channel.id,
    guild: interaction.guildID!,
  });
  return;
};

const command = new Component("bump-words").run(run).autoack();

export default command;
