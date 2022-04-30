import { Run } from "petal";
import { MinigameError } from "../../../../lib/error/minigame-error";
import { startGuessTheIdol } from "../../../../lib/graphql/mutation/game/minigame/guess-the-idol/startGuessTheIdol";
import { getGuessTheIdol } from "../../../../lib/graphql/query/game/minigame/guess-the-idol/getGuessTheIdol";
import { emoji } from "../../../../lib/util/formatting/emoji";
import { Embed } from "../../../../struct/embed";

export const minigamePlayRun: Run = async ({ courier, options, user }) => {
  const _minigame = await getGuessTheIdol(user);

  if (_minigame && _minigame.state === "PENDING") {
    throw MinigameError.RewardsPendingClaim;
  } else if (_minigame && _minigame.type !== "GUESS_THE_IDOL") {
    throw MinigameError.AlreadyPlayingMinigame;
  } else if (_minigame && _minigame.state === "PLAYING") {
    throw MinigameError.AlreadyPlayingIdols;
  }

  const loading = new Embed().setDescription(`**Loading...** ${emoji.song}`);
  const loadingMessage = await courier.send({ embeds: [loading] });

  const minigameType = options.getOption<"idols">("minigame")!;

  if (minigameType === "idols") {
    const gender = options
      .getOption<"male" | "female">("gender")
      ?.toUpperCase() as "MALE" | "FEMALE";

    const group = options.getOption<string>("group");

    await startGuessTheIdol(
      user.discordId,
      {
        messageId: loadingMessage!.id,
        channelId: loadingMessage!.channel.id,
        guildId: loadingMessage!.guildID!,
      },
      { gender, group }
    );

    const embed = new Embed().setDescription(
      `**i'm thinking of a${
        gender ? ` ${gender.toLowerCase()}` : "n"
      } idol...** who is it?` +
        `\nuse **/minigame guess \`idol: idol name\`** to guess!`
    );

    await courier.edit({ embeds: [embed] });
    return;
  } else {
    // OMGWTFBBQ
  }

  return;
};
