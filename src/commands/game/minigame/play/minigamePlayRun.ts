import { CharacterGuessData, Run } from "petal";
import { MinigameError } from "../../../../lib/error/minigame-error";
import { getRandomCharacter } from "../../../../lib/graphql/query/categorization/character/getRandomCharacter";
import { getMinigame, setMinigame } from "../../../../lib/minigame";
import { Embed } from "../../../../struct/embed";

export const minigamePlayRun: Run = async ({ courier, options, user }) => {
  const activeMinigame = await getMinigame(user);

  if (activeMinigame) {
    const type = activeMinigame.data.type;

    if (type === "GTS") throw MinigameError.AlreadyPlayingGTS;
    if (type === "GUESS_CHARACTER") throw MinigameError.AlreadyPlayingIdols;
    if (type === "WORDS")
      throw MinigameError.AlreadyPlayingWords({ ...activeMinigame, user });
  }

  const minigameType = options.getOption<"idols">("minigame")!;

  if (minigameType === "idols") {
    const gender = options
      .getOption<"male" | "female">("gender")
      ?.toUpperCase() as "MALE" | "FEMALE";

    const character = await getRandomCharacter(gender);

    const embed = new Embed().setDescription(
      `**i'm thinking of a${
        gender ? ` ${gender.toLowerCase()}` : "n"
      } idol...** who is it?` +
        `\nuse **/minigame guess \`idol: idol name\`** to guess!`
    );

    const msg = await courier.send({ embeds: [embed] });

    const data: CharacterGuessData = {
      type: "GUESS_CHARACTER",
      answer: character,
      guesses: [],
      startedAt: Date.now(),
    };

    await setMinigame(user, data, {
      guild: courier.interaction!.guildID!,
      channel: courier.interaction!.channel.id,
      message: msg!.id,
    });

    return;
  } else {
    // OMGWTFBBQ
  }

  return;
};
