import { CommandInteraction } from "eris";
import { Run } from "petal";
import { MinigameError } from "../../../../../lib/error/minigame-error";
import { startGuessTheSong } from "../../../../../lib/graphql/mutation/game/minigame/guess-the-song/startGuessTheSong";
import { canClaimRewards } from "../../../../../lib/graphql/query/game/CAN_CLAIM_REWARDS";
import { getGuessTheSong } from "../../../../../lib/graphql/query/game/minigame/guess-the-song/getGuessTheSong";
import { logger } from "../../../../../lib/logger";
import { handleGTSEnd } from "../../../../../lib/minigame/gts";
import { dd } from "../../../../../lib/statsd";
import { row, button } from "../../../../../lib/util/component";
import { emoji } from "../../../../../lib/util/formatting/emoji";
import { strong } from "../../../../../lib/util/formatting/strong";
import { Embed } from "../../../../../struct/embed";

export const songPlayRun: Run = async function run({ courier, user, options }) {
  const _minigame = await getGuessTheSong(user);

  if (_minigame && _minigame.state === "PENDING") {
    throw MinigameError.RewardsPendingClaim;
  } else if (_minigame && _minigame.type !== "GTS") {
    throw MinigameError.AlreadyPlayingMinigame;
  } else if (_minigame && _minigame.state === "PLAYING") {
    throw MinigameError.AlreadyPlayingGTS;
  }

  const loading = new Embed().setDescription(`**Loading...** ${emoji.song}`);
  const loadingMessage = await courier.send({ embeds: [loading] });

  const gender = options.getOption<"male" | "female">("gender");

  const minigame = await startGuessTheSong(
    user.discordId,
    {
      messageId: loadingMessage?.id!,
      channelId: loadingMessage?.channel.id!,
      guildId: loadingMessage?.guildID!,
    },
    { gender: gender?.toUpperCase() as "MALE" | "FEMALE" | undefined }
  );

  const canClaim = await canClaimRewards(user.discordId);

  try {
    const embed = new Embed()
      .setDescription(
        `${emoji.song} **Guess the song by using \`/song guess\`!**` +
          `\nTime limit: ${strong(minigame.timeLimit / 1000)} seconds` +
          `\nMaximum guesses: ${strong(minigame.maxAttempts)}`
      )
      .setImage("https://cdn.playpetal.com/banners/default.png");

    if (canClaim)
      embed.setFooter(
        `You can claim ${canClaim} more reward${
          canClaim !== 1 ? "s" : ""
        } this hour!`
      );

    const message = await courier.edit(
      {
        embeds: [embed],
        components: [
          row(
            button({
              customId: `cancel-gts?${user.id}`,
              label: "cancel",
              style: "red",
            })
          ),
        ],
      },
      { file: Buffer.from(minigame.video!, "base64"), name: "song.mp4" }
    );

    dd.increment(`petal.minigame.gts.started`);

    const interval = setInterval(async () => {
      const game = await getGuessTheSong(user);

      if (!game) {
        clearInterval(interval);
        return;
      }

      if (game.messageId !== message.id) {
        await message.delete();
        clearInterval(interval);
        return;
      }

      const { state } = game;

      if (state !== "PLAYING") {
        clearInterval(interval);
        return await handleGTSEnd(
          courier.interaction as CommandInteraction,
          game
        );
      }
    }, 500);
  } catch (e) {
    logger.error(e);
    throw e;
  }
};
