import { Run, SlashCommand } from "../../../struct/command";
import { Embed } from "../../../struct/embed";
import { findBestMatch } from "string-similarity";
import { gtsGameStateManager } from "../../../lib/fun/gts";
import { BotError } from "../../../struct/error";
import { emoji } from "../../../lib/util/formatting/emoji";

const run: Run = async function ({ interaction, user, options }) {
  const state = gtsGameStateManager.getState(user.id);

  if (!state)
    throw new BotError(
      "**you're not playing!**\nuse **/song** to start a game."
    );

  state.guesses += 1;

  const answer = options.getOption<string>("guess")!;

  const title = state.song.title.toLowerCase().replace(/[^a-zA-Z0-9]/gm, "");
  const groupTitle = `${state.song.group || ""}${state.song.title}`
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]/gm, "");

  const match = findBestMatch(
    answer.toLowerCase().replace(/[^a-zA-Z0-9]/gm, ""),
    [title, groupTitle]
  );

  const correct = match.bestMatch.rating >= 0.75;

  const embed = new Embed();

  if (correct) {
    state.correct = true;
    gtsGameStateManager.setState(user.id, state);

    embed
      .setColor("#3BA55D")
      .setDescription(`${emoji.song} **${answer}** was correct!`);
    await interaction.createMessage({ embeds: [embed], flags: 64 });
  } else {
    gtsGameStateManager.setState(user.id, state);

    embed
      .setColor("#F04747")
      .setDescription(
        `${emoji.song} **${answer}** was incorrect! You have **${
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
