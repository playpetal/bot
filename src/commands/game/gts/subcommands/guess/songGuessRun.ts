import { CommandInteraction } from "eris";
import { Run } from "petal";
import { MinigameError } from "../../../../../lib/error/minigame-error";
import { answerGuessTheSong } from "../../../../../lib/graphql/mutation/game/minigame/guess-the-song/answerGuessTheSong";
import { getGuessTheSong } from "../../../../../lib/graphql/query/game/minigame/guess-the-song/getGuessTheSong";
import { handleGTSEnd } from "../../../../../lib/minigame/gts";
import { emoji } from "../../../../../lib/util/formatting/emoji";
import { Embed } from "../../../../../struct/embed";

export const songGuessRun: Run = async function ({ courier, user, options }) {
  const _minigame = await getGuessTheSong(user);

  if (_minigame && _minigame.state === "PENDING") {
    throw MinigameError.RewardsPendingClaim;
  } else if (_minigame && _minigame.type !== "GUESS_THE_SONG") {
    throw MinigameError.NotPlayingGTS;
  } else if (_minigame && _minigame.state === "PLAYING") {
    throw MinigameError.AlreadyPlayingGTS;
  }

  const answer = options.getOption<string>("guess")!;

  const minigame = await answerGuessTheSong(user.discordId, answer);

  const correct =
    minigame.state === "PENDING" || minigame.state === "COMPLETED";

  const embed = new Embed();

  if (correct) {
    embed
      .setColor("#3BA55D")
      .setDescription(`${emoji.song} **${answer}** was correct!`);

    await courier.send({ embeds: [embed], flags: 64 });

    await handleGTSEnd(courier.interaction! as CommandInteraction, minigame);
  } else {
    const remaining = minigame.maxAttempts - minigame.attempts.length;
    embed
      .setColor("#F04747")
      .setDescription(
        `${
          emoji.song
        } **${answer}** was incorrect! You have **${remaining}** guess${
          remaining !== 1 ? "es" : ""
        } remaining!`
      );
    await courier.send({ embeds: [embed], flags: 64 });
  }
};
