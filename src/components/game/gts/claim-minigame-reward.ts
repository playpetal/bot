import { MinigameError } from "../../../lib/error/minigame-error";
import { completeGuessTheSong } from "../../../lib/graphql/mutation/game/minigame/guess-the-song/completeGuessTheSong";
import { getGuessTheSong } from "../../../lib/graphql/query/game/minigame/guess-the-song/getGuessTheSong";
import { getCardImage } from "../../../lib/img";
import { generateWords } from "../../../lib/minigame/words";
import { emoji } from "../../../lib/util/formatting/emoji";
import { formatCard } from "../../../lib/util/formatting/format";
import { Component, RunComponent } from "../../../struct/component";
import { Embed } from "../../../struct/embed";

const run: RunComponent = async function ({ interaction, user }) {
  const [_customId, options] = interaction.data.custom_id.split("?");
  if (!options) return;

  const [_accountId, reward, _type] = options.split("&");
  const accountId = parseInt(_accountId, 10);
  const type = _type as "GTS";

  if (accountId !== user.id) throw MinigameError.NotOwnerOfMinigame;

  const minigame = await getGuessTheSong(user);

  if (!minigame) throw MinigameError.InvalidMinigame;

  let isCorrect = minigame.state === "PENDING";

  if (!isCorrect) throw MinigameError.InvalidMinigame;

  const embed = new Embed().setColor("#3BA55D");
  let image: Buffer | undefined;

  let desc: string = "";

  // const rewardSelection = reward.toUpperCase() as "CARD" | "PETAL" | "LILY";

  let guesses = minigame.attempts.length;
  let elapsed = minigame.elapsed!;

  if (type === "GTS") {
    desc = `${emoji.song} **You got it in ${guesses} guess${
      guesses !== 1 ? "es" : ""
    } (${(elapsed! / 1000).toFixed(2)}s)!**`;
  } else if (type === "WORDS") {
    desc = `${emoji.bloom} **petle ${guesses}/6**\n\n${generateWords(
      minigame
    )}\n\n${emoji.bloom} **you got it in ${guesses} guess${
      guesses !== 1 ? "es" : ""
    } (${(elapsed / 1000).toFixed(2)}s)!**`;
  } else if (type === "GUESS_CHARACTER") {
    desc = `${
      emoji.bloom
    } **you got \`${"<ANSWER>"}\` in ${guesses} guesses!**`;
  }

  /*await completeMinigame(
    data.type,
    user.discordId,
    guesses,
    elapsed,
    rewardSelection
  );*/

  if (reward === "petal") {
    await completeGuessTheSong(user.discordId, "PETAL");

    desc += `\nyou were rewarded ${emoji.petals} **5**!`;
  } else if (reward === "card") {
    const { card } = await completeGuessTheSong(user.discordId, "CARD");

    desc += `\nyou received ${formatCard(card!)}!`;
    image = await getCardImage(card!);
    embed.setThumbnail(`attachment://card.png`);
  } else if (reward === "lily") {
    await completeGuessTheSong(user.discordId, "LILY");

    desc += `\nyou were rewarded ${emoji.lily} **1**!`;
  }

  embed.setDescription(desc);

  await interaction.editOriginalMessage(
    { embeds: [embed], components: [] },
    image ? [{ file: image, name: `card.png` }] : undefined
  );

  return;
};

const command = new Component("claim-minigame-reward").run(run).autoack();

export default command;
