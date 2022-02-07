import { CommandInteraction } from "eris";
import { GTS, SlashCommandOption } from "petal";
import { completeGts } from "../../../lib/graphql/mutation/COMPLETE_GTS";
import { getGTSStats } from "../../../lib/graphql/query/GET_GTS_STATS";
import { getRandomSong } from "../../../lib/graphql/query/GET_RANDOM_SONG";
import { redis } from "../../../lib/redis";
import { emoji } from "../../../lib/util/formatting/emoji";
import { strong } from "../../../lib/util/formatting/strong";
import { Run, SlashCommand } from "../../../struct/command";
import { Embed } from "../../../struct/embed";
import { BotError } from "../../../struct/error";

const run: Run = async function ({ interaction, user, options }) {
  const gtsString = await redis.get(`gts:game:${user.id}`);

  if (gtsString)
    throw new BotError(
      "**you're already playing a game!**\nfinish your current minigame first 😒"
    );

  const loading = new Embed().setDescription(`**Loading...** ${emoji.song}`);
  await interaction.createMessage({ embeds: [loading] });

  const gender = options.getOption<"male" | "female">("gender");

  const song = await getRandomSong(
    gender?.toUpperCase() as "MALE" | "FEMALE" | undefined
  );

  if (!song)
    throw new BotError(
      `${emoji.song} there are no available songs 😔 try again later!`
    );

  const { stats } = (await getGTSStats(user.id))!;
  const isNewHour =
    new Date().getHours() !==
    (stats?.gtsLastGame ? new Date(stats.gtsLastGame).getHours() : -1);

  let isExtra = false;

  if (stats.gtsCurrentGames >= 3 && !isNewHour) {
    isExtra = true;
  }

  let { maxReward, timeLimit, maxGuesses } = song;

  if (isExtra) {
    maxReward = 0;
    maxGuesses = 10;
  }

  try {
    const embed = new Embed()
      .setDescription(
        `${emoji.song} **Guess the song by using /guess!**` +
          `\n\nModifiers: **None**` +
          `\nMaximum reward: ${emoji.petals} ${strong(maxReward)}` +
          `\nTime limit: ${strong(timeLimit / 1000)} seconds` +
          `\nMaximum guesses: ${strong(maxGuesses)}`
      )
      .setFooter(
        isExtra
          ? `Rewards won't be given since you've already won 3 games this hour.`
          : `You can win ${
              isNewHour ? 3 : 3 - stats.gtsCurrentGames
            } more games this hour!`
      )
      .setImage("https://cdn.playpetal.com/banners/default.png");

    const message = await interaction.editOriginalMessage(
      { embeds: [embed] },
      { file: Buffer.from(song.video, "base64"), name: "song.mp4" }
    );

    const state = JSON.stringify({
      startedAt: Date.now(),
      maxReward,
      timeLimit,
      maxGuesses,
      playerId: user.id,
      gameMessageId: message.id,
      song: song,
      guesses: 0,
      correct: false,
    });

    await redis.set(`gts:game:${user.id}`, state);

    const interval = setInterval(async () => {
      const gameStr = await redis.get(`gts:game:${user.id}`);

      if (!gameStr) {
        clearInterval(interval);
        return;
      }

      const game = JSON.parse(gameStr) as GTS;
      const { correct, guesses, maxGuesses, startedAt } = game;

      if (
        correct ||
        guesses >= maxGuesses ||
        startedAt <= Date.now() - timeLimit
      ) {
        clearInterval(interval);
        return await handleGTSEnd(interaction, game);
      }
    }, 500);
  } catch (e) {
    console.error(e);
    throw e;
  }
};

async function handleGTSEnd(
  interaction: CommandInteraction,
  { playerId, startedAt, maxGuesses, guesses, maxReward, correct, song }: GTS
) {
  await redis.del(`gts:game:${playerId}`);
  let embed = new Embed();

  const time = Date.now() - startedAt;
  const reward = Math.floor(
    ((maxGuesses - (guesses - 1)) / maxGuesses) * maxReward
  );

  if (correct) {
    embed
      .setColor("#3BA55D")
      .setDescription(
        `${emoji.song} **You got it in ${guesses} guess${
          guesses !== 1 ? "es" : ""
        } (${(time / 1000).toFixed(2)}s)!**` +
          (maxReward === 0
            ? `\nYou did not receive any petals for this game.`
            : `\nYou've been rewarded ${emoji.petals} ${strong(
                reward
              )}, enjoy!`)
      )
      .setImage("https://cdn.playpetal.com/banners/default.png");
  } else {
    embed.setColor("#F04747");
    let desc = "**Better luck next time!**";

    if (guesses >= maxGuesses) {
      embed.setDescription(desc + "\nYou ran out of guesses!");
    } else {
      embed.setDescription(desc + "\nYou ran out of time!");
    }
  }

  try {
    await completeGts(
      interaction.member!.id,
      guesses,
      time,
      reward,
      song.id,
      correct,
      startedAt
    );
  } catch (e: any) {
    console.log(e.networkError.result.errors);
  }

  try {
    await interaction.editOriginalMessage({ embeds: [embed] }, []);
  } catch (e) {
    // do nothing, the original message was probably deleted
  }
  return;
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
  } as SlashCommandOption<"string">);
