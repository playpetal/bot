import { getGTSRewardLeaderboard } from "../../../lib/graphql/query/game/leaderboard/GET_GTS_REWARD_LEADERBOARD";
import { getGTSTimeLeaderboard } from "../../../lib/graphql/query/game/leaderboard/GET_GTS_TIME_LEADERBOARD";
import { displayName } from "../../../lib/util/displayName";
import { emoji } from "../../../lib/util/formatting/emoji";
import { strong } from "../../../lib/util/formatting/strong";
import { Run, SlashCommand } from "../../../struct/command";
import { Embed } from "../../../struct/embed";

function render(entries: string[]): string {
  return entries
    .map((v) => `**#${entries.indexOf(v) + 1}** ${emoji.user} ${v}`)
    .join("\n");
}

const run: Run = async function ({ interaction, user, options }) {
  const type = options.options[0];
  const typeName = type.name;

  const board = type.options![0];
  const boardName = board.name;

  let header: string = `${emoji.bloom} **unknown leaderboard**`;
  let body: string = `there's nothing here...?!`;

  if (typeName === "songs") {
    header = `**leaderboard - guess the song**`;

    if (boardName === "time") {
      header += `\n${emoji.song} top 10 fastest guessers (average)`;

      const users = await getGTSTimeLeaderboard();
      const formatted = users.map(
        (u) => `${displayName(u.account)} - **${(u.time / 1000).toFixed(2)}s**`
      );

      body = render(formatted);
    } else if (boardName === "petals") {
      header += `\n${emoji.song} top 10 earners (petals)`;

      const users = await getGTSRewardLeaderboard("PETAL");
      const formatted = users.map(
        (u) => `${displayName(u.account)} - ${emoji.petals} ${strong(u.value)}`
      );

      body = render(formatted);
    } else if (boardName === "lilies") {
      header += `\n${emoji.song} top 10 earners (lilies)`;

      const users = await getGTSRewardLeaderboard("LILY");
      const formatted = users.map(
        (u) => `${displayName(u.account)} - ${emoji.lily} ${strong(u.value)}`
      );

      body = render(formatted);
    } else if (boardName === "cards") {
      header += `\n${emoji.song} top 10 earners (cards)`;

      const users = await getGTSRewardLeaderboard("CARD");
      const formatted = users.map(
        (u) => `${displayName(u.account)} - ${emoji.cards} ${strong(u.value)}`
      );

      body = render(formatted);
    }
  }

  const embed = new Embed().setDescription(`${header}\n\n${body}`);

  return await interaction.createMessage({ embeds: [embed] });
};

export default new SlashCommand("leaderboard")
  .desc("views a leaderboard")
  .option({
    type: "subcommandGroup",
    name: "songs",
    description: "guess the song leaderboards",
    options: [
      {
        type: "subcommand",
        name: "time",
        description: "guess the song time leaderboards",
      },
      {
        type: "subcommand",
        name: "petals",
        description:
          "shows the players who have earned the most petals from GTS",
      },
      {
        type: "subcommand",
        name: "lilies",
        description:
          "shows the players who have earned the most lilies from GTS",
      },
      {
        type: "subcommand",
        name: "cards",
        description:
          "shows the players who have earned the most cards from GTS",
      },
    ],
  })
  .run(run);
