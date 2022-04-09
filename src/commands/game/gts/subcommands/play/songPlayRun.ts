import { Run } from "petal";
import { MinigameError } from "../../../../../lib/error/minigame-error";
import { canClaimRewards } from "../../../../../lib/graphql/query/game/CAN_CLAIM_REWARDS";
import { getRandomSong } from "../../../../../lib/graphql/query/GET_RANDOM_SONG";
import { logger } from "../../../../../lib/logger";
import { getMinigame, setMinigame } from "../../../../../lib/minigame";
import {
  GTS_MAX_MS,
  GTS_MAX_GUESSES,
} from "../../../../../lib/minigame/constants";
import { handleGTSEnd } from "../../../../../lib/minigame/gts";
import { dd } from "../../../../../lib/statsd";
import { row, button } from "../../../../../lib/util/component";
import { emoji } from "../../../../../lib/util/formatting/emoji";
import { strong } from "../../../../../lib/util/formatting/strong";
import { Embed } from "../../../../../struct/embed";

export const songPlayRun: Run = async function run({
  courier,
  interaction,
  user,
  options,
}) {
  const minigame = await getMinigame(user);

  if (minigame) {
    if (minigame.data.type === "GTS") throw MinigameError.AlreadyPlayingGTS;

    if (minigame.data.type === "GUESS_CHARACTER")
      throw MinigameError.AlreadyPlayingIdols;

    if (minigame.data.type === "WORDS")
      throw MinigameError.AlreadyPlayingWords({ ...minigame, user });
  }

  const loading = new Embed().setDescription(`**Loading...** ${emoji.song}`);
  await courier.send({ embeds: [loading] });

  const gender = options.getOption<"male" | "female">("gender");

  const song = await getRandomSong(
    user.discordId,
    gender?.toUpperCase() as "MALE" | "FEMALE" | undefined
  );

  if (!song) {
    const embed = new Embed().setDescription(
      "**uh-oh!**\nthere are no available songs 😔 try again later!"
    );

    await interaction.editOriginalMessage({ embeds: [embed] });
    return;
  }

  const canClaim = await canClaimRewards(user.discordId);

  try {
    const embed = new Embed()
      .setDescription(
        `${emoji.song} **Guess the song by using \`/song guess\`!**` +
          `\nTime limit: ${strong(GTS_MAX_MS / 1000)} seconds` +
          `\nMaximum guesses: ${strong(GTS_MAX_GUESSES)}`
      )
      .setImage("https://cdn.playpetal.com/banners/default.png");

    if (canClaim)
      embed.setFooter(
        `You can claim ${canClaim} more reward${
          canClaim !== 1 ? "s" : ""
        } this hour!`
      );

    const message = await interaction.editOriginalMessage(
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
      { file: Buffer.from(song.video!, "base64"), name: "song.mp4" }
    );

    await setMinigame<"GTS">(
      user,
      {
        type: "GTS",
        startedAt: Date.now(),
        song: { ...song, video: undefined },
        guesses: 0,
        correct: false,
      },
      {
        message: message.id,
        channel: message.channel.id,
        guild: message.guildID!,
      }
    );

    dd.increment(`petal.minigame.gts.started`);

    const interval = setInterval(async () => {
      const game = await getMinigame<"GTS">(user);

      if (!game) {
        clearInterval(interval);
        return;
      }

      if (game.message !== message.id) {
        await message.delete();
        clearInterval(interval);
        return;
      }

      const { correct, guesses, startedAt } = game.data;

      if (
        correct ||
        guesses >= GTS_MAX_GUESSES ||
        startedAt <= Date.now() - GTS_MAX_MS
      ) {
        clearInterval(interval);
        return await handleGTSEnd(interaction, game);
      }
    }, 500);
  } catch (e) {
    logger.error(e);
    throw e;
  }
};
