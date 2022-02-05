import { CommandInteraction } from "eris";
import { SlashCommandOption } from "petal";
import { GTSGameState, gtsGameStateManager } from "../../../lib/fun/gts";
import { completeGts } from "../../../lib/graphql/mutation/COMPLETE_GTS";
import { getGTSStats } from "../../../lib/graphql/query/GET_GTS_STATS";
import { getRandomSong } from "../../../lib/graphql/query/GET_RANDOM_SONG";
import { emoji } from "../../../lib/util/formatting/emoji";
import { strong } from "../../../lib/util/formatting/strong";
import { Run, SlashCommand } from "../../../struct/command";
import { Embed } from "../../../struct/embed";
import { BotError } from "../../../struct/error";

const run: Run = async function ({ interaction, user, options }) {
  const hasState = gtsGameStateManager.getState(user.id);

  if (hasState)
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

  if (stats.gtsCurrentGames > 2) {
    isExtra = true;
  } else if (!isNewHour) {
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

    let state: GTSGameState = {
      startedAt: Date.now(),
      maxReward,
      timeLimit,
      maxGuesses,
      playerId: user.id,
      gameMessageId: message.id,
      song: song,
      guesses: 0,
      correct: false,
    };

    gtsGameStateManager.setState(user.id, state);

    const interval = setInterval(async () => {
      const newState = gtsGameStateManager.getState(user.id);

      if (!newState) {
        clearInterval(interval);
        return;
      }

      if (
        newState.correct ||
        newState.guesses >= newState.maxGuesses ||
        newState.startedAt <= Date.now() - newState.timeLimit
      ) {
        clearInterval(interval);
        return await handleGTSEnd(interaction, newState);
      }
    }, 500);
  } catch (e) {
    console.error(e);
    throw e;
  }
};

async function handleGTSEnd(
  interaction: CommandInteraction,
  state: GTSGameState
) {
  gtsGameStateManager.unsetState(state.playerId);
  let embed = new Embed();

  const time = Date.now() - state.startedAt;
  const reward = Math.floor(
    ((state.maxGuesses - (state.guesses - 1)) / state.maxGuesses) *
      state.maxReward
  );

  if (state.correct) {
    embed
      .setColor("#3BA55D")
      .setDescription(
        `${emoji.song} **You got it in ${state.guesses} guess${
          state.guesses !== 1 ? "es" : ""
        } (${(time / 1000).toFixed(2)}s)!**` +
          (state.maxReward === 0
            ? `\nYou did not receive any petals for this game.`
            : `\nYou've been rewarded ${emoji.petals} ${strong(
                reward
              )}, enjoy!`)
      )
      .setImage("https://cdn.playpetal.com/banners/default.png");
  } else {
    embed.setColor("#F04747");
    let desc = "**Better luck next time!**";

    if (state.guesses >= state.maxGuesses) {
      embed.setDescription(desc + "\nYou ran out of guesses!");
    } else {
      embed.setDescription(desc + "\nYou ran out of time!");
    }
  }

  try {
    await completeGts(
      interaction.member!.id,
      state.guesses,
      time,
      reward,
      state.song.id,
      state.correct,
      state.startedAt
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
