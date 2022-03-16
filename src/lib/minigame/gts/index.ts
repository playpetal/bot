import { CommandInteraction } from "eris";
import { Minigame } from "petal";
import { destroyMinigame } from "..";
import { Embed } from "../../../struct/embed";
import { canClaimPremiumRewards } from "../../graphql/query/game/CAN_CLAIM_PREMIUM_REWARDS";
import { canClaimRewards } from "../../graphql/query/game/CAN_CLAIM_REWARDS";
import { dd } from "../../statsd";
import { getMinigameRewardComponents } from "../../util/component/minigame";
import { emoji } from "../../util/formatting/emoji";
import { GTS_MAX_GUESSES } from "../constants";

export async function handleGTSEnd(
  interaction: CommandInteraction,
  minigame: Minigame<"GTS">
) {
  const {
    playerId,
    data: { correct, guesses, song, elapsed },
  } = minigame;

  if (!correct) {
    await destroyMinigame(playerId);

    return interaction.editOriginalMessage({
      embeds: [
        new Embed()
          .setDescription(
            "**Better luck next time!**\n" +
              (guesses >= GTS_MAX_GUESSES
                ? "You ran out of guesses!"
                : "You ran out of time!") +
              `\n\nYou just heard || ${emoji.song} **${song.title}** by ${
                song.group || song.soloist || "an unknown artist"
              }||!`
          )
          .setColor("#F04747"),
      ],
      components: [],
    });
  }

  dd.increment(`petal.minigame.${minigame.type.toLowerCase()}.completed`);

  const embed = new Embed().setColor("#3BA55D");

  const description = `${emoji.song} **You got it in ${guesses} guess${
    guesses !== 1 ? "es" : ""
  } (${(elapsed! / 1000).toFixed(2)}s)!**`;

  const rewardsRemaining = await canClaimRewards(interaction.member!.id);

  if (rewardsRemaining === 0) {
    await destroyMinigame(playerId);

    embed.setDescription(
      description + `\nYou've already claimed all the rewards this hour.`
    );
  } else {
    embed.setDescription(
      description + `\nChoose your reward from the options below!`
    );
  }

  try {
    return interaction.editOriginalMessage({
      embeds: [embed],
      components:
        rewardsRemaining > 0
          ? await getMinigameRewardComponents(
              playerId,
              (await canClaimPremiumRewards(interaction.member!.id)) > 0
            )
          : [],
    });
  } catch (e) {
    // do nothing, the original message was probably deleted
  }
}
