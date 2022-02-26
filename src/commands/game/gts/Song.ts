import { CommandInteraction } from "eris";
import { GTSData, Minigame } from "petal";
import { bot } from "../../..";
import { MinigameError } from "../../../lib/error/minigame-error";
import { GTS_MAX_GUESSES, GTS_MAX_MS } from "../../../lib/fun/game/constants";
import { canClaimPremiumRewards } from "../../../lib/graphql/query/game/CAN_CLAIM_PREMIUM_REWARDS";
import { canClaimRewards } from "../../../lib/graphql/query/game/CAN_CLAIM_REWARDS";
import { getRandomSong } from "../../../lib/graphql/query/GET_RANDOM_SONG";
import { logger } from "../../../lib/logger";
import {
  destroyMinigame,
  getMinigame,
  setMinigame,
} from "../../../lib/minigame";
import { button, row } from "../../../lib/util/component";
import { getGTSRewardComponents } from "../../../lib/util/component/minigame";
import { emoji } from "../../../lib/util/formatting/emoji";
import { strong } from "../../../lib/util/formatting/strong";
import { Run, SlashCommand } from "../../../struct/command";
import { Embed } from "../../../struct/embed";

const run: Run = async function ({ interaction, user, options }) {
  const minigame = await getMinigame(user);

  if (minigame) {
    if (minigame.type !== "GTS") throw MinigameError.AlreadyPlayingMinigame;

    const { startedAt, channel, message } = minigame.data as GTSData;

    if (startedAt > Date.now() - GTS_MAX_MS)
      throw MinigameError.AlreadyPlayingGTS;

    try {
      await destroyMinigame(user);
      const gameMessage = await bot.getMessage(channel, message);
      await gameMessage.edit({
        embeds: [
          new Embed()
            .setColor("#F04747")
            .setDescription("**Better luck next time!**\nYou ran out of time!"),
        ],
        components: [],
      });
    } catch {}
  }

  const loading = new Embed().setDescription(`**Loading...** ${emoji.song}`);
  await interaction.createMessage({ embeds: [loading] });

  const gender = options.getOption<"male" | "female">("gender");

  const song = await getRandomSong(
    user.discordId,
    gender?.toUpperCase() as "MALE" | "FEMALE" | undefined
  );

  if (!song) throw MinigameError.NoAvailableSongs;

  const canClaim = await canClaimRewards(user.discordId);

  try {
    const embed = new Embed()
      .setDescription(
        `${emoji.song} **Guess the song by using /guess!**` +
          `\nTime limit: ${strong(GTS_MAX_MS / 1000)} seconds` +
          `\nMaximum guesses: ${strong(GTS_MAX_GUESSES)}`
      )
      .setFooter(
        canClaim
          ? `You can claim ${canClaim} more reward${
              canClaim !== 1 ? "s" : ""
            } this hour!`
          : `Rewards won't be given since you've already won 3 games this hour.`
      )
      .setImage("https://cdn.playpetal.com/banners/default.png");

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

    const state = await setMinigame<"GTS">(user, {
      startedAt: Date.now(),
      message: message.id,
      channel: message.channel.id,
      song: { ...song, video: undefined },
      guesses: 0,
      correct: false,
    });

    logger.info(state);

    const interval = setInterval(async () => {
      const game = await getMinigame<"GTS">(user);

      if (!game) {
        clearInterval(interval);
        return;
      }

      if (game.data.message !== message.id) {
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

async function handleGTSEnd(
  interaction: CommandInteraction,
  { playerId, data: { guesses, correct, song, elapsed } }: Minigame<"GTS">
) {
  if (!correct) {
    await destroyMinigame(playerId);

    return interaction.editOriginalMessage({
      embeds: [
        new Embed().setDescription(
          "**Better luck next time!**\n" +
            (guesses >= GTS_MAX_GUESSES
              ? "You ran out of guesses!"
              : "You ran out of time!") +
            `\n\nYou just heard || ${emoji.song} **${song.title}** by ${
              song.group || "a Soloist"
            }||!`
        ),
      ],
      components: [],
    });
  }

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
          ? await getGTSRewardComponents(
              playerId,
              (await canClaimPremiumRewards(interaction.member!.id)) > 0
            )
          : [],
    });
  } catch (e) {
    // do nothing, the original message was probably deleted
  }
}

export default new SlashCommand("song")
  .desc("gts")
  .run(run)
  .option({
    type: "string",
    name: "gender",
    description: "limits your song to only boys or girls",
    choices: [
      { name: "boys", value: "male" },
      { name: "girls", value: "female" },
    ],
  });
