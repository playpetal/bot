import { CommandInteraction } from "eris";
import { Minigame } from "petal";
import { Embed } from "../../../struct/embed";
import { canClaimPremiumRewards } from "../../graphql/query/game/CAN_CLAIM_PREMIUM_REWARDS";
import { canClaimRewards } from "../../graphql/query/game/CAN_CLAIM_REWARDS";
import { dd } from "../../statsd";
import { getMinigameRewardComponents } from "../../util/component/minigame";
import { emoji } from "../../util/formatting/emoji";

export async function handleGTSEnd(
  interaction: CommandInteraction,
  minigame: Minigame<"GUESS_THE_SONG">
) {
  const { accountId, state, attempts, maxAttempts, elapsed } = minigame;

  if (state === "CANCELLED") return;

  if (state === "FAILED") {
    return interaction.editMessage(minigame.messageId, {
      embeds: [
        new Embed()
          .setDescription(
            "**Better luck next time!**\n" +
              (attempts.length >= maxAttempts
                ? "You ran out of guesses!"
                : "You ran out of time!") +
              `\n\nYou just heard || ${emoji.song} **${
                minigame.song?.title || "An Unknown Song"
              }** by ${
                minigame.song?.group ||
                minigame.song?.soloist ||
                "an unknown artist"
              }||!`
          )
          .setColor("#F04747"),
      ],
      components: [],
    });
  }

  dd.increment(`petal.minigame.guess-the-song.completed`);

  const embed = new Embed().setColor("#3BA55D");

  const description = `${emoji.song} **You got it in ${attempts.length} guess${
    attempts.length !== 1 ? "es" : ""
  } (${(elapsed! / 1000).toFixed(2)}s)!**`;

  const rewardsRemaining = await canClaimRewards(interaction.member!.id);

  if (rewardsRemaining === 0) {
    embed.setDescription(
      description + `\nYou earned ${emoji.petals} **1** for playing.`
    );
  } else {
    embed.setDescription(
      description + `\nChoose your reward from the options below!`
    );
  }

  try {
    return interaction.editMessage(minigame.messageId, {
      embeds: [embed],
      components:
        rewardsRemaining > 0
          ? await getMinigameRewardComponents(
              accountId,
              (await canClaimPremiumRewards(interaction.member!.id)) > 0,
              "GUESS_THE_SONG"
            )
          : [],
    });
  } catch (e) {
    // do nothing, the original message was probably deleted
  }
}
