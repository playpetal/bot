import { Run, SlashCommand } from "../../../struct/command";
import { Embed } from "../../../struct/embed";
import { findBestMatch } from "string-similarity";
import { gtsGameStateManager } from "../../../lib/fun/gts";
import { BotError } from "../../../struct/error";

const run: Run = async function ({ interaction, user, options }) {
  const state = gtsGameStateManager.getState(user.id);

  if (!state)
    throw new BotError(
      "**you're not playing!**\nuse **/song** to start a game."
    );

  state.guesses += 1;

  // @ts-ignore - im lazy
  const answer = options.getOption<string>("guess")!;

  const match = findBestMatch(answer, [
    state.song.title.toLowerCase(),
    `${state.song.group.toLowerCase()} ${state.song.title.toLowerCase()}`,
  ]);
  const correct = match.bestMatch.rating >= 0.9;

  const embed = new Embed();

  if (correct) {
    state.correct = true;
    gtsGameStateManager.setState(user.id, state);

    embed
      .setColor("#3BA55D")
      .setDescription(`<:song:930932998138900540> **${answer}** was correct!`);
    await interaction.createMessage({ embeds: [embed], flags: 64 });
  } else {
    gtsGameStateManager.setState(user.id, state);

    embed
      .setColor("#F04747")
      .setDescription(
        `<:song:930932998138900540> **${answer}** was incorrect! You have **${
          state.maxGuesses - state.guesses
        }** guesses remaining!`
      );
    await interaction.createMessage({ embeds: [embed], flags: 64 });
  }
};

export default new SlashCommand("guess").desc("gts").run(run).option({
  type: "string",
  name: "guess",
  description: "use this to make your guess in the 'guess the song' minigame!",
  required: true,
});
