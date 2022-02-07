import { Run, SlashCommand } from "../../../struct/command";
import { Embed } from "../../../struct/embed";
import { findBestMatch } from "string-similarity";
import { BotError } from "../../../struct/error";
import { emoji } from "../../../lib/util/formatting/emoji";
import { redis } from "../../../lib/redis";
import { GTS } from "petal";

const run: Run = async function ({ interaction, user, options }) {
  const gameStr = await redis.get(`gts:game:${user.id}`);

  if (!gameStr)
    throw new BotError(
      "**you're not playing!**\nuse **/song** to start a game."
    );

  const game = JSON.parse(gameStr) as GTS;

  game.guesses += 1;

  const answer = options.getOption<string>("guess")!;

  const title = game.song.title.toLowerCase().replace(/[^a-zA-Z0-9]/gm, "");
  const groupTitle = `${game.song.group || ""}${game.song.title}`
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]/gm, "");

  const match = findBestMatch(
    answer.toLowerCase().replace(/[^a-zA-Z0-9]/gm, ""),
    [title, groupTitle]
  );

  const correct = match.bestMatch.rating >= 0.75;

  const embed = new Embed();

  if (correct) {
    game.correct = true;
    const state = JSON.stringify(game);
    await redis.set(`gts:game:${user.id}`, state);

    embed
      .setColor("#3BA55D")
      .setDescription(`${emoji.song} **${answer}** was correct!`);
    await interaction.createMessage({ embeds: [embed], flags: 64 });
  } else {
    const state = JSON.stringify(game);
    await redis.set(`gts:game:${user.id}`, state);

    embed
      .setColor("#F04747")
      .setDescription(
        `${emoji.song} **${answer}** was incorrect! You have **${
          game.maxGuesses - game.guesses
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
