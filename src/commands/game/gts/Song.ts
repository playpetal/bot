import { CommandInteraction } from "eris";
import { Minigame, UnknownMinigame } from "petal";
import { bot } from "../../..";
import { MinigameError } from "../../../lib/error/minigame-error";
import { GTS_MAX_GUESSES, GTS_MAX_MS } from "../../../lib/minigame/constants";
import { canClaimPremiumRewards } from "../../../lib/graphql/query/game/CAN_CLAIM_PREMIUM_REWARDS";
import { canClaimRewards } from "../../../lib/graphql/query/game/CAN_CLAIM_REWARDS";
import { getRandomSong } from "../../../lib/graphql/query/GET_RANDOM_SONG";
import { logger } from "../../../lib/logger";
import {
  destroyMinigame,
  getMinigame,
  isGTS,
  isWords,
  setMinigame,
} from "../../../lib/minigame";
import { button, row } from "../../../lib/util/component";
import { getMinigameRewardComponents } from "../../../lib/util/component/minigame";
import { emoji } from "../../../lib/util/formatting/emoji";
import { strong } from "../../../lib/util/formatting/strong";
import { Run } from "../../../struct/command";
import { Embed } from "../../../struct/embed";
import { findBestMatch } from "string-similarity";
import { CONSTANTS } from "../../../lib/constants";
import { slashCommand } from "../../../lib/command";
import { dd } from "../../../lib/statsd";

const run: Run = async function ({ interaction, user, options }) {
  const subcommand = options.getSubcommand()!;

  if (subcommand.name === "play") {
    const minigame = await getMinigame(user);

    if (minigame) {
      if (minigame.type === "WORDS")
        throw MinigameError.AlreadyPlayingWords({ ...minigame, user });

      const {
        data: { startedAt },
        channel,
        message,
      } = minigame as Minigame<"GTS">;

      if (startedAt > Date.now() - GTS_MAX_MS)
        throw MinigameError.AlreadyPlayingGTS;

      try {
        await destroyMinigame(user);
        const gameMessage = await bot.getMessage(channel, message);
        await gameMessage.edit({
          embeds: [
            new Embed()
              .setColor("#F04747")
              .setDescription(
                "**Better luck next time!**\nYou ran out of time!"
              ),
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
          `${emoji.song} **Guess the song by using \`/song guess\`!**` +
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

      await setMinigame<"GTS">(
        user,
        {
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
  } else if (subcommand.name === "guess") {
    const minigame = await getMinigame(user);

    if (!minigame) throw MinigameError.NotPlayingGTS;

    const data = (minigame as UnknownMinigame).data;

    if (isWords(data))
      throw MinigameError.AlreadyPlayingWords({ ...minigame, user });

    if (!isGTS(data)) throw MinigameError.NotPlayingGTS;

    if (data.startedAt < Date.now() - GTS_MAX_MS) {
      await destroyMinigame(user);

      try {
        const originalMessage = await bot.getMessage(
          minigame.channel,
          minigame.message
        );

        const embed = new Embed()
          .setColor("#F04747")
          .setDescription("**Better luck next time!**\nYou ran out of time!");

        await originalMessage.edit({ embeds: [embed] });
      } catch {}

      throw MinigameError.NotPlayingGTS;
    }

    data.guesses += 1;

    const answer = options.getOption<string>("guess")!;

    const title = data.song.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]|and/gm, "");
    const groupTitle = `${data.song.group || ""}${data.song.title}`
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]|and/gm, "");

    const match = findBestMatch(
      answer.toLowerCase().replace(/[^a-zA-Z0-9]/gm, ""),
      [title, groupTitle]
    );

    logger.info(JSON.stringify(match));

    const correct = match.bestMatch.rating >= 0.75;

    const embed = new Embed();

    if (correct) {
      data.correct = true;
      data.elapsed = interaction.createdAt - data.startedAt;

      await setMinigame<"GTS">(user, data, minigame);

      embed
        .setColor("#3BA55D")
        .setDescription(`${emoji.song} **${answer}** was correct!`);
      await interaction.createMessage({ embeds: [embed], flags: 64 });
    } else {
      await setMinigame<"GTS">(user, data, minigame);

      embed
        .setColor("#F04747")
        .setDescription(
          `${emoji.song} **${answer}** was incorrect! You have **${
            GTS_MAX_GUESSES - data.guesses
          }** guesses remaining!`
        );
      await interaction.createMessage({ embeds: [embed], flags: 64 });
    }
  }
};

async function handleGTSEnd(
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
                song.group || "a Soloist"
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

export default slashCommand("song")
  .desc("gts")
  .run(run)
  .option({
    type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
    name: "play",
    description: "starts a new guess the song game!",
    options: [
      {
        type: CONSTANTS.OPTION_TYPE.STRING,
        name: "gender",
        description: "limits your song to only boy or girl groups",
        choices: [
          { name: "boys", value: "male" },
          { name: "girls", value: "female" },
        ],
      },
    ],
  })
  .option({
    type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
    name: "guess",
    description: "guess the name of the song!",
    options: [
      {
        type: CONSTANTS.OPTION_TYPE.STRING,
        name: "guess",
        description:
          "use this to make your guess in the 'guess the song' minigame!",
        required: true,
      },
    ],
    ephemeral: true,
  });
