import { getGTSTimeLeaderboard } from "../../../lib/graphql/query/game/leaderboard/GET_GTS_TIME_LEADERBOARD";
import { displayName } from "../../../lib/util/displayName";
import { Run, SlashCommand } from "../../../struct/command";
import { Embed } from "../../../struct/embed";

const run: Run = async function ({ interaction, user, options }) {
  const type = options.options[0];
  const typeName = type.name;

  const board = type.options![0];
  const boardName = board.name;

  if (typeName === "songs") {
    if (boardName === "time") {
      const users = await getGTSTimeLeaderboard();

      const embed = new Embed()
        .setDescription(
          `__**top 10 fastest song guessers (average)**__\n\n` +
            users
              .map(
                (u) =>
                  `${displayName(u.account)} - **${(u.time / 1000).toFixed(
                    2
                  )}s**`
              )
              .join("\n")
        )
        .setFooter("you must play 50 games to appear on the leaderboard!");

      return await interaction.createMessage({ embeds: [embed] });
    }
  }
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
    ],
  })
  .run(run);
