import { CommandInteraction, Constants } from "eris";
import { PartialUser } from "petal";
import { gts } from "../../../lib/fun/gts";
import { GTSGameState, gtsGameStateManager } from "../../../lib/fun/gts/state";
import { SlashCommand } from "../../../struct/command";
import { Embed } from "../../../struct/embed";

const run = async function (
  interaction: CommandInteraction,
  user: PartialUser
) {
  const hasState = gtsGameStateManager.getState(user.id);

  if (hasState) {
    throw new Error("already");
  }

  const loadingEmbed = new Embed().setDescription(
    "**Loading...** <:song:930932998138900540>"
  );

  await interaction.createMessage({ embeds: [loadingEmbed] });

  const firstGuessReward = await gts.getFirstGuessReward();
  const timeLimit = await gts.getTimeLimit();
  const maxGuesses = await gts.getMaxGuesses();

  try {
    const song = await gts.getSong();

    const embed = new Embed()
      .setDescription(
        `<:song:930932998138900540> **Guess the song by using /guess!**\n\nModifiers: **None**\nMaximum reward: <:petals:930918815225741383> **${firstGuessReward}**\nTime limit: **${timeLimit} seconds**\nMaximum guesses: **${maxGuesses}**`
      )
      .setFooter("Example command: /guess singing in the rain")
      .setImage("https://cdn.playpetal.com/banners/default.png");

    const message = await interaction.editOriginalMessage(
      {
        embeds: [embed],
      },
      { file: song.buffer, name: "song.mp4" }
    );

    let state: GTSGameState = {
      startedAt: Date.now(),
      firstGuessReward,
      timeLimit,
      maxGuesses,
      playerId: user.id,
      gameMessageId: message.id,
      song: song.song,
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
        newState.startedAt <= Date.now() - newState.timeLimit * 1000
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

  const reward = state.firstGuessReward;

  if (state.correct) {
    embed
      .setColor("#3BA55D")
      .setDescription(
        `<:song:930932998138900540> **You got it in ${state.guesses} guess${
          state.guesses !== 1 ? "es" : ""
        }!**\nYou've been rewarded <:petals:930918815225741383> **${reward}**, enjoy!`
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
    await interaction.editOriginalMessage({ embeds: [embed] }, []);
  } catch (e) {
    // do nothing cuz the original message was probably deleted
  }
  return;
}

const command = new SlashCommand("song", "GTS prototype", run, [
  {
    name: "gender",
    description: "limits your song to only boys or girls",
    type: Constants.ApplicationCommandOptionTypes.STRING,
    choices: [
      { name: "boys", value: "boys" },
      { name: "girls", value: "girls" },
    ],
  },
]);

export default command;
