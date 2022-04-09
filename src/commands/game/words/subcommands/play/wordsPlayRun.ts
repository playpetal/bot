import { Run, WordsData } from "petal";
import { MinigameError } from "../../../../../lib/error/minigame-error";
import { canClaimRewards } from "../../../../../lib/graphql/query/game/CAN_CLAIM_REWARDS";
import { getWord } from "../../../../../lib/graphql/query/game/GET_WORD";
import { getMinigame, setMinigame } from "../../../../../lib/minigame";
import { getWordsEmbed } from "../../../../../lib/minigame/words";
import { dd } from "../../../../../lib/statsd";
import { row, button } from "../../../../../lib/util/component";

const run: Run = async function run({ interaction, user }) {
  const minigame = await getMinigame(user);

  if (minigame) {
    if (minigame.data.type === "GTS") throw MinigameError.AlreadyPlayingGTS;
    if (minigame.data.type === "GUESS_CHARACTER")
      throw MinigameError.AlreadyPlayingIdols;
    if (minigame.data.type === "WORDS")
      throw MinigameError.AlreadyPlayingWords({ ...minigame, user });
  }

  const word = await getWord(user.discordId);

  const data: WordsData = {
    type: "WORDS",
    answer: word,
    guesses: [],
    startedAt: Date.now(),
  };

  const rewardsRemaining = await canClaimRewards(interaction.member!.id);

  const message = await interaction.editOriginalMessage({
    embeds: [getWordsEmbed(data, user, rewardsRemaining)],
    components: [
      row(
        button({
          customId: `cancel-words?${user.id}`,
          style: "red",
          label: "cancel",
        })
      ),
    ],
  });

  await setMinigame<"WORDS">(user, data, {
    message: message.id,
    channel: message.channel.id,
    guild: interaction.guildID!,
  });

  dd.increment(`petal.minigame.words.started`);

  return;
};

export default run;
