import { CommandInteraction } from "eris";
import { SlashCommandOption } from "petal";
import { GTSGameState, gtsGameStateManager } from "../../../lib/fun/gts";
import { completeGts } from "../../../lib/graphql/mutation/COMPLETE_GTS";
import { getRandomSong } from "../../../lib/graphql/query/GET_RANDOM_SONG";
import { Run, SlashCommand } from "../../../struct/command";
import { Embed, ErrorEmbed } from "../../../struct/embed";

const run: Run = async function ({ interaction, user, options }) {
  const hasState = gtsGameStateManager.getState(user.id);

  if (hasState) {
    throw new Error("already");
  }

  const loadingEmbed = new Embed().setDescription(
    "**Loading...** <:song:930932998138900540>"
  );

  const gender = options.getOption<"male" | "female">("gender");

  await interaction.createMessage({ embeds: [loadingEmbed] });

  const song = await getRandomSong(
    gender?.toUpperCase() as "MALE" | "FEMALE" | undefined
  );

  if (!song) {
    return await interaction.editOriginalMessage({
      embeds: [
        new ErrorEmbed(
          "<:song:930932998138900540> there are no available songs, try again later 😔"
        ),
      ],
    });
  }

  const { maxReward, timeLimit, maxGuesses } = song;

  try {
    const embed = new Embed()
      .setDescription(
        `<:song:930932998138900540> **Guess the song by using /guess!**\n\nModifiers: **None**\nMaximum reward: <:petals:930918815225741383> **${maxReward}**\nTime limit: **${
          timeLimit / 1000
        } seconds**\nMaximum guesses: **${maxGuesses}**`
      )
      .setFooter("Example command: /guess singing in the rain")
      .setImage("https://cdn.playpetal.com/banners/default.png");

    const message = await interaction.editOriginalMessage(
      {
        embeds: [embed],
      },
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
    console.log(e);
    await interaction.editOriginalMessage({ content: "Error!" });
    return;
  }

  return;
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
        `<:song:930932998138900540> **You got it in ${state.guesses} guess${
          state.guesses !== 1 ? "es" : ""
        } (${(time / 1000).toFixed(
          2
        )}s)!**\nYou've been rewarded <:petals:930918815225741383> **${reward}**, enjoy!`
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
