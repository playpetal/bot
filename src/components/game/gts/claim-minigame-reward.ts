import { Maybe, Minigame, MinigameType } from "petal";
import { MinigameError } from "../../../lib/error/minigame-error";
import { completeMinigame } from "../../../lib/graphql/mutation/game/minigame/completeMinigame";
import { getGuessTheIdol } from "../../../lib/graphql/query/game/minigame/guess-the-idol/getGuessTheIdol";
import { getGuessTheSong } from "../../../lib/graphql/query/game/minigame/guess-the-song/getGuessTheSong";
import { getTrivia } from "../../../lib/graphql/query/game/minigame/trivia/getTrivia";
import { getCardImage } from "../../../lib/img";
import { emoji } from "../../../lib/util/formatting/emoji";
import { formatCard } from "../../../lib/util/formatting/format";
import { Component, RunComponent } from "../../../struct/component";
import { Embed } from "../../../struct/embed";

const run: RunComponent = async function ({ interaction, user }) {
  const [_customId, options] = interaction.data.custom_id.split("?");
  if (!options) return;

  const [_accountId, reward, _type] = options.split("&");
  const accountId = parseInt(_accountId, 10);
  const type = _type as MinigameType;

  if (accountId !== user.id) throw MinigameError.NotOwnerOfMinigame;

  let minigame: Maybe<Minigame<typeof type>> = null;

  if (type === "GUESS_THE_SONG") {
    minigame = await getGuessTheSong(user);
  } else if (type === "GUESS_THE_IDOL") {
    minigame = await getGuessTheIdol(user);
  } else if (type === "TRIVIA") {
    minigame = await getTrivia(user);
  }

  if (!minigame) throw MinigameError.InvalidMinigame;
  let isCorrect = minigame.state === "PENDING";

  if (!isCorrect) throw MinigameError.InvalidMinigame;

  const embed = new Embed().setColor("#3BA55D");
  let image: Buffer | undefined;

  let desc: string = "";
  let elapsed = minigame.elapsed!;

  if (minigame.type === "TRIVIA") {
    desc = `${emoji.user} **${minigame.question}**\nyou correctly answered **${
      minigame.answer
    }** in **${(elapsed! / 1000).toFixed(2)}s!**\n`;
  } else {
    let guesses = minigame.attempts.length;

    if (minigame.type === "GUESS_THE_SONG") {
      desc = `${emoji.song} **You got it in ${guesses} guess${
        guesses !== 1 ? "es" : ""
      } (${(elapsed! / 1000).toFixed(2)}s)!**`;
    } else if (minigame.type === "GUESS_THE_IDOL") {
      desc = `${emoji.bloom} **you got \`${
        minigame.character!.name
      }\` in ${guesses} guess${guesses === 1 ? "" : "es"}!**`;
    }
  }

  if (reward === "petal") {
    await completeMinigame(user.discordId, "PETAL");

    desc += `\nyou were rewarded ${emoji.petals} **5**!`;
  } else if (reward === "card") {
    const { card } = await completeMinigame(user.discordId, "CARD");

    desc += `\nyou received ${formatCard(card!)}!`;

    try {
      image = await getCardImage(card!);
    } catch {}

    embed.setThumbnail(`attachment://card.png`);
  } else if (reward === "lily") {
    await completeMinigame(user.discordId, "LILY");

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
