import { CommandInteraction, Constants } from "eris";
import { PartialUser } from "petal";
import { SlashCommand } from "../../../struct/command";
import { Embed } from "../../../struct/embed";
import { findBestMatch } from "string-similarity";
import { gtsGameStateManager } from "../../../lib/fun/gts/state";

const run = async function (
  interaction: CommandInteraction,
  user: PartialUser
) {
  const state = gtsGameStateManager.getState(user.id);

  if (!state) {
    throw new Error("not in game");
  }

  state.guesses += 1;

  // @ts-ignore - im lazy
  const answer = interaction.data.options[0].value.toLowerCase();

  const match = findBestMatch(answer, [
    state.song.title.toLowerCase(),
    `${state.song.group.name.toLowerCase()} ${state.song.title.toLowerCase()}`,
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

const command = new SlashCommand("guess", "GTS prototype", run, [
  {
    type: Constants.ApplicationCommandOptionTypes.STRING,
    name: "guess",
    description: "GTS prototype",
    required: true,
  },
]);

export default command;
