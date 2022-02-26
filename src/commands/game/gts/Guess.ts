import { Run, SlashCommand } from "../../../struct/command";
import { Embed } from "../../../struct/embed";
import { findBestMatch } from "string-similarity";
import { BotError } from "../../../struct/error";
import { emoji } from "../../../lib/util/formatting/emoji";
import { bot } from "../../..";
import { logger } from "../../../lib/logger";
import { GTS_MAX_GUESSES, GTS_MAX_MS } from "../../../lib/fun/game/constants";
import {
  destroyMinigame,
  getMinigame,
  setMinigame,
} from "../../../lib/minigame";
import { Minigame } from "petal";

const run: Run = async function ({ interaction, user, options }) {
  const minigame = await getMinigame(user);

  if (!minigame)
    throw new BotError(
      "**you're not playing!**\nuse **/song** to start a game."
    );

  let data = (minigame as Minigame<"GTS">).data;

  if (data.startedAt < Date.now() - GTS_MAX_MS) {
    await destroyMinigame(user);

    try {
      const originalMessage = await bot.getMessage(data.channel, data.message);

      const embed = new Embed()
        .setColor("#F04747")
        .setDescription("**Better luck next time!**\nYou ran out of time!");

      await originalMessage.edit({ embeds: [embed] });
    } catch {
      // ignore
    }

    throw new BotError(
      "**you're not playing!**\nuse **/song** to start a game."
    );
  }

  data.guesses += 1;

  const answer = options.getOption<string>("guess")!;

  const title = data.song.title.toLowerCase().replace(/[^a-zA-Z0-9]/gm, "");
  const groupTitle = `${data.song.group || ""}${data.song.title}`
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]/gm, "");

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

    await setMinigame<"GTS">(user, data);

    embed
      .setColor("#3BA55D")
      .setDescription(`${emoji.song} **${answer}** was correct!`);
    await interaction.createMessage({ embeds: [embed], flags: 64 });
  } else {
    await setMinigame<"GTS">(user, data);

    embed
      .setColor("#F04747")
      .setDescription(
        `${emoji.song} **${answer}** was incorrect! You have **${
          GTS_MAX_GUESSES - data.guesses
        }** guesses remaining!`
      );
    await interaction.createMessage({ embeds: [embed], flags: 64 });
  }
};

export default new SlashCommand("guess")
  .desc("gts")
  .run(run)
  .option({
    type: "string",
    name: "guess",
    description:
      "use this to make your guess in the 'guess the song' minigame!",
    required: true,
  })
  .ephemeral();
