import { Button, Run } from "petal";
import { MinigameError } from "../../../../../lib/error/minigame-error";
import { startTrivia } from "../../../../../lib/graphql/mutation/game/minigame/trivia/startTrivia";
import { getTrivia } from "../../../../../lib/graphql/query/game/minigame/trivia/getTrivia";
import { button, row } from "../../../../../lib/util/component";
import { emoji } from "../../../../../lib/util/formatting/emoji";
import { shuffleArray } from "../../../../../lib/util/shuffleArray";
import { Embed, ErrorEmbed } from "../../../../../struct/embed";
import { BotError } from "../../../../../struct/error";

export const triviaPlayRun: Run = async function run({
  courier,
  user,
  options,
}) {
  const _minigame = await getTrivia(user);

  if (_minigame && _minigame.state === "PENDING") {
    throw MinigameError.RewardsPendingClaim;
  } else if (_minigame && _minigame.type !== "TRIVIA") {
    throw MinigameError.AlreadyPlayingMinigame;
  } else if (_minigame && _minigame.state === "PLAYING") {
    throw MinigameError.AlreadyPlayingTrivia;
  }

  const loading = new Embed().setDescription(`**Loading...** ${emoji.song}`);
  const loadingMessage = await courier.send({ embeds: [loading] });

  const gender = options.getOption<"male" | "female">("gender");
  const group = options.getOption<string>("group");

  try {
    const minigame = await startTrivia(
      user.discordId,
      {
        messageId: loadingMessage?.id!,
        channelId: loadingMessage?.channel.id!,
        guildId: loadingMessage?.guildID!,
      },
      { gender: gender?.toUpperCase() as "MALE" | "FEMALE" | undefined, group }
    );

    const embed = new Embed().setDescription(
      `${emoji.user} **${minigame.question}**\nmake your answer by clicking one of the buttons!`
    );

    const buttons: Button[] = [];

    for (let option of shuffleArray(minigame.options)) {
      buttons.push(
        button({
          customId: `answer-trivia?${user.id}&${option}`,
          style: "gray",
          label: option,
        })
      );
    }

    const message = await courier.edit({
      embeds: [embed],
      components: [row(...buttons)],
    });

    const interval = setInterval(async () => {
      const game = await getTrivia(user);

      if (!game) {
        clearInterval(interval);
        return;
      }

      if (game.messageId !== message.id) {
        await message.delete();
        clearInterval(interval);
        return;
      }

      const { state } = game;

      if (state !== "PLAYING") {
        clearInterval(interval);
        // idk
        return;
      }
    }, 500);
  } catch (e) {
    if (e instanceof BotError) {
      await courier.edit({
        embeds: [new ErrorEmbed(e.message)],
      });
      return;
    }

    throw e;
  }
};
