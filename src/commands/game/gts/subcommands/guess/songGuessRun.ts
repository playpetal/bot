import { Run, UnknownMinigame } from "petal";
import { findBestMatch } from "string-similarity";
import { bot } from "../../../../..";
import { MinigameError } from "../../../../../lib/error/minigame-error";
import { logger } from "../../../../../lib/logger";
import {
  getMinigame,
  destroyMinigame,
  setMinigame,
  isWords,
  isGTS,
} from "../../../../../lib/minigame";
import {
  GTS_MAX_MS,
  GTS_MAX_GUESSES,
} from "../../../../../lib/minigame/constants";
import { emoji } from "../../../../../lib/util/formatting/emoji";
import { Embed } from "../../../../../struct/embed";

const run: Run = async function ({ interaction, user, options }) {
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

  const title = data.song.title.toLowerCase().replace(/[^a-zA-Z0-9]|and/gm, "");
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
};

export default run;
