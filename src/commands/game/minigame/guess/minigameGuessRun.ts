import { Components, Run } from "petal";
import { MinigameError } from "../../../../lib/error/minigame-error";
import { answerGuessTheIdol } from "../../../../lib/graphql/mutation/game/minigame/guess-the-idol/answerGuessTheIdol";
import { canClaimPremiumRewards } from "../../../../lib/graphql/query/game/CAN_CLAIM_PREMIUM_REWARDS";
import { canClaimRewards } from "../../../../lib/graphql/query/game/CAN_CLAIM_REWARDS";
import { getGuessTheIdol } from "../../../../lib/graphql/query/game/minigame/guess-the-idol/getGuessTheIdol";
import { isInactive } from "../../../../lib/minigame/util/isInactive";
import { getMinigameRewardComponents } from "../../../../lib/util/component/minigame";
import { emoji } from "../../../../lib/util/formatting/emoji";
import { Embed } from "../../../../struct/embed";

export const minigameGuessRun: Run = async ({ courier, user, options }) => {
  const minigame = await getGuessTheIdol(user);

  if (!minigame || isInactive(minigame)) throw MinigameError.NotPlayingMinigame;
  if (minigame.state === "PENDING") throw MinigameError.RewardsPendingClaim;

  if (minigame.type === "GUESS_THE_IDOL") {
    const guess = options.getOption<string>("idol");

    if (!guess) {
      const embed = new Embed().setDescription(
        "**uh-oh!**\nplease guess an idol by using **/minigame guess `idol: idol name`**!"
      );

      await courier.send({ embeds: [embed] });

      return;
    }

    const _minigame = await answerGuessTheIdol(user.discordId, guess);

    if (_minigame.state === "PENDING" || _minigame.state === "COMPLETED") {
      let embed = new Embed();
      let components: Components = [];

      let desc = `**you got \`${_minigame.character!.name}\` in ${
        _minigame.attempts.length
      } guess${_minigame.attempts.length === 1 ? "" : "es"}!**`;

      const rewardsRemaining = await canClaimRewards(user.discordId);

      if (rewardsRemaining === 0) {
        desc += `\nyou were rewarded ${emoji.petals} **1** for playing.`;
      } else {
        desc += `\nchoose your reward from the options below!`;
        components = await getMinigameRewardComponents(
          user.id,
          (await canClaimPremiumRewards(user.discordId)) > 0,
          _minigame.type
        );
      }

      embed.setDescription(desc);

      await courier.send({ embeds: [embed], components });
      return;
    }

    let birthdayStr, genderStr, lettersStr;
    const attempt = _minigame.attempts[_minigame.attempts.length - 1];

    const date = new Date(attempt.birthday!).toISOString().split("T")[0];

    if (attempt.birthDate === "EQUAL") {
      birthdayStr = `${emoji.check} the idol was born **on ${date}**.`;
    } else {
      birthdayStr = `${emoji.cross} the idol was born **${
        attempt.birthDate === "LESS" ? "before" : "after"
      } ${date}**.`;
    }

    if (attempt.isGender) {
      genderStr = `${emoji.check} the idol **is ${
        attempt.gender?.toLowerCase() || "ungendered"
      }**.`;
    } else {
      genderStr = `${emoji.cross} the idol **is not ${
        attempt.gender?.toLowerCase() || "ungendered"
      }**.`;
    }

    if (attempt.nameLength === "LESS") {
      lettersStr = `${emoji.cross} the idol has **less letters** in their name than \`${attempt.name}\`.`;
    } else if (attempt.nameLength === "GREATER") {
      lettersStr = `${emoji.cross} the idol has **more letters** in their name than \`${attempt.name}\`.`;
    } else {
      lettersStr = `${emoji.check} the idol has **the same amount of letters** in their name as \`${attempt.name}\`.`;
    }

    const embed = new Embed().setDescription(
      `${birthdayStr}\n${genderStr}\n${lettersStr}`
    );

    await courier.send({ embeds: [embed] });
    return;
  }

  return;
};
