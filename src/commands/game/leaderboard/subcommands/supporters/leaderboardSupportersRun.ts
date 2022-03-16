import { Run } from "petal";
import { getSupporterLeaderboard } from "../../../../../lib/graphql/query/game/leaderboard/GET_SUPPORTER_LEADERBOARD";
import { displayName } from "../../../../../lib/util/displayName";
import { emoji } from "../../../../../lib/util/formatting/emoji";
import { renderLeaderboard } from "../../../../../lib/util/formatting/leaderboard";
import { Embed } from "../../../../../struct/embed";

const run: Run = async function run({ interaction }) {
  let header = `**leaderboard - top supporters**\n${emoji.song} `;
  let body: string = `*there's nothing here...?!*`;

  header = `**leaderboard - top supporters**\n${emoji.bloom} top petal supporters (server time purchased)`;

  const users = await getSupporterLeaderboard();
  const formatted = users.map(
    (u) => `${displayName(u.account)} [**${u.value}h**]`
  );

  body = renderLeaderboard(formatted);

  const embed = new Embed().setDescription(`${header}\n\n${body}`);
  return await interaction.createMessage({ embeds: [embed] });
};

export default run;
