import { Run } from "petal";
import { getGTSRewardLeaderboard } from "../../../../../lib/graphql/query/game/leaderboard/GET_GTS_REWARD_LEADERBOARD";
import { getGTSTimeLeaderboard } from "../../../../../lib/graphql/query/game/leaderboard/GET_GTS_TIME_LEADERBOARD";
import { displayName } from "../../../../../lib/util/displayName";
import { emoji } from "../../../../../lib/util/formatting/emoji";
import { renderLeaderboard } from "../../../../../lib/util/formatting/leaderboard";
import { strong } from "../../../../../lib/util/formatting/strong";
import { Embed } from "../../../../../struct/embed";

const run: Run = async function run({ interaction, options }) {
  const board = options.getOption<string>("board")!;

  let header = `**leaderboard - guess the song**\n${emoji.song} `;
  let body: string = `*there's nothing here...?!*`;

  if (board === "time") {
    header += `top 10 fastest guessers (average)`;

    const users = await getGTSTimeLeaderboard();
    const formatted = users.map(
      (u) => `${displayName(u.account)} [**${(u.value / 1000).toFixed(2)}s**]`
    );

    body = renderLeaderboard(formatted);
  } else if (board === "petals") {
    header += `top 10 earners (petals)`;

    const users = await getGTSRewardLeaderboard("PETAL");
    const formatted = users.map(
      (u) => `${displayName(u.account)} [${emoji.petals} ${strong(u.value)}]`
    );

    body = renderLeaderboard(formatted);
  } else if (board === "lilies") {
    header += `top 10 earners (lilies)`;

    const users = await getGTSRewardLeaderboard("LILY");
    const formatted = users.map(
      (u) => `${displayName(u.account)} [${emoji.lily} ${strong(u.value)}]`
    );

    body = renderLeaderboard(formatted);
  } else if (board === "cards") {
    header += `top 10 earners (cards)`;

    const users = await getGTSRewardLeaderboard("CARD");
    const formatted = users.map(
      (u) => `${displayName(u.account)} [${emoji.cards} ${strong(u.value)}]`
    );

    body = renderLeaderboard(formatted);
  }

  const embed = new Embed().setDescription(`${header}\n\n${body}`);
  return await interaction.createMessage({ embeds: [embed] });
};

export default run;
