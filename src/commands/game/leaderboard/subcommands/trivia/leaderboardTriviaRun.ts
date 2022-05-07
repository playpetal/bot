import { Run } from "petal";
import { getLeaderboard } from "../../../../../lib/graphql/query/game/leaderboard/getLeaderboard";
import { displayName } from "../../../../../lib/util/displayName";
import { emoji } from "../../../../../lib/util/formatting/emoji";
import { emphasis } from "../../../../../lib/util/formatting/emphasis";
import { renderLeaderboard } from "../../../../../lib/util/formatting/leaderboard";
import { Embed } from "../../../../../struct/embed";

export const leaderboardTriviaRun: Run = async function run({
  courier,
  options,
}) {
  const board = options.getOption<string>("board")!;

  let header = `**leaderboard - trivia**\n${emoji.user} `;
  let body: string = `*there's nothing here...?!*`;

  if (board === "time") {
    header += `top 10 fastest guessers (average)`;

    const users = await getLeaderboard("TRIVIAxTIME");
    const formatted = users.map(
      (u) => `${displayName(u.account)} [**${(u.value / 1000).toFixed(2)}s**]`
    );

    body = renderLeaderboard(formatted);
  } else if (board === "petals") {
    header += `top 10 earners (petals)`;

    const users = await getLeaderboard("TRIVIAxPETAL");
    const formatted = users.map(
      (u) => `${displayName(u.account)} [${emoji.petals} ${emphasis(u.value)}]`
    );

    body = renderLeaderboard(formatted);
  } else if (board === "lilies") {
    header += `top 10 earners (lilies)`;

    const users = await getLeaderboard("TRIVIAxLILY");
    const formatted = users.map(
      (u) => `${displayName(u.account)} [${emoji.lily} ${emphasis(u.value)}]`
    );

    body = renderLeaderboard(formatted);
  } else if (board === "cards") {
    header += `top 10 earners (cards)`;

    const users = await getLeaderboard("TRIVIAxCARD");
    const formatted = users.map(
      (u) => `${displayName(u.account)} [${emoji.cards} ${emphasis(u.value)}]`
    );

    body = renderLeaderboard(formatted);
  }

  const embed = new Embed().setDescription(`${header}\n\n${body}`);
  return await courier.send({ embeds: [embed] });
};
