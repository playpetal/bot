import { slashCommand } from "../../../lib/command";
import { CONSTANTS } from "../../../lib/constants";
import { getGTSRewardLeaderboard } from "../../../lib/graphql/query/game/leaderboard/GET_GTS_REWARD_LEADERBOARD";
import { getGTSTimeLeaderboard } from "../../../lib/graphql/query/game/leaderboard/GET_GTS_TIME_LEADERBOARD";
import { getSupporterLeaderboard } from "../../../lib/graphql/query/game/leaderboard/GET_SUPPORTER_LEADERBOARD";
import { getWordsRewardLeaderboard } from "../../../lib/graphql/query/game/leaderboard/GET_WORDS_REWARD_LEADERBOARD";
import { getWordsTimeLeaderboard } from "../../../lib/graphql/query/game/leaderboard/GET_WORDS_TIME_LEADERBOARD";
import { displayName } from "../../../lib/util/displayName";
import { emoji } from "../../../lib/util/formatting/emoji";
import { strong } from "../../../lib/util/formatting/strong";
import { Run } from "../../../struct/command";
import { Embed } from "../../../struct/embed";

function render(entries: string[]): string {
  return entries
    .map(
      (v) =>
        `\`${`#${entries.indexOf(v) + 1}`.padStart(3, " ")}\` ${
          emoji.user
        } ${v}`
    )
    .join("\n");
}

const run: Run = async function ({ interaction, user, options }) {
  const subcommand = options.getSubcommand()!;

  let header: string = `${emoji.bloom} **unknown leaderboard**`;
  let body: string = `there's nothing here...?!`;

  if (subcommand.name === "supporters") {
    header = `**leaderboard - top supporters**\n${emoji.bloom} top petal supporters (server time purchased)`;

    const users = await getSupporterLeaderboard();
    const formatted = users.map(
      (u) => `${displayName(u.account)} [**${u.value}h**]`
    );

    body = render(formatted);
  }

  if (subcommand.name === "songs") {
    header = `**leaderboard - guess the song**`;
    const board = options.getOption<string>("board")!;

    if (board === "time") {
      header += `\n${emoji.song} top 10 fastest guessers (average)`;

      const users = await getGTSTimeLeaderboard();
      const formatted = users.map(
        (u) => `${displayName(u.account)} [**${(u.value / 1000).toFixed(2)}s**]`
      );

      body = render(formatted);
    } else if (board === "petals") {
      header += `\n${emoji.song} top 10 earners (petals)`;

      const users = await getGTSRewardLeaderboard("PETAL");
      const formatted = users.map(
        (u) => `${displayName(u.account)} [${emoji.petals} ${strong(u.value)}]`
      );

      body = render(formatted);
    } else if (board === "lilies") {
      header += `\n${emoji.song} top 10 earners (lilies)`;

      const users = await getGTSRewardLeaderboard("LILY");
      const formatted = users.map(
        (u) => `${displayName(u.account)} [${emoji.lily} ${strong(u.value)}]`
      );

      body = render(formatted);
    } else if (board === "cards") {
      header += `\n${emoji.song} top 10 earners (cards)`;

      const users = await getGTSRewardLeaderboard("CARD");
      const formatted = users.map(
        (u) => `${displayName(u.account)} [${emoji.cards} ${strong(u.value)}]`
      );

      body = render(formatted);
    }
  } else if (subcommand.name === "petle") {
    header = `**leaderboard - petle**\n${emoji.bloom} `;
    const board = options.getOption<string>("board")!;

    if (board === "time") {
      header += `top 10 fastest guessers (average)`;

      const users = await getWordsTimeLeaderboard();
      const formatted = users.map(
        (u) => `${displayName(u.account)} [**${(u.value / 1000).toFixed(2)}s**]`
      );

      body = render(formatted);
    } else if (board === "petals") {
      header += `top 10 earners (petals)`;

      const users = await getWordsRewardLeaderboard("PETAL");
      const formatted = users.map(
        (u) => `${displayName(u.account)} [${emoji.petals} ${strong(u.value)}]`
      );

      body = render(formatted);
    } else if (board === "lilies") {
      header += `top 10 earners (lilies)`;

      const users = await getWordsRewardLeaderboard("LILY");
      const formatted = users.map(
        (u) => `${displayName(u.account)} [${emoji.lily} ${strong(u.value)}]`
      );

      body = render(formatted);
    } else if (board === "cards") {
      header += `top 10 earners (cards)`;

      const users = await getWordsRewardLeaderboard("CARD");
      const formatted = users.map(
        (u) => `${displayName(u.account)} [${emoji.cards} ${strong(u.value)}]`
      );

      body = render(formatted);
    }
  }

  const embed = new Embed().setDescription(`${header}\n\n${body}`);
  return await interaction.createMessage({ embeds: [embed] });
};

export default slashCommand("leaderboard")
  .desc("views a leaderboard")
  .option({
    type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
    name: "songs",
    description: "show leaderboards for 'guess the song'",
    options: [
      {
        type: CONSTANTS.OPTION_TYPE.STRING,
        name: "board",
        description: "the leaderboard you want to view",
        choices: [
          { name: "time", value: "time" },
          { name: "petals", value: "petals" },
          { name: "lilies", value: "lilies" },
          { name: "cards", value: "cards" },
        ],
        required: true,
      },
    ],
  })
  .option({
    type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
    name: "petle",
    description: "show leaderboards for 'petle'",
    options: [
      {
        type: CONSTANTS.OPTION_TYPE.STRING,
        name: "board",
        description: "the leaderboard you want to view",
        choices: [
          { name: "time", value: "time" },
          { name: "petals", value: "petals" },
          { name: "lilies", value: "lilies" },
          { name: "cards", value: "cards" },
        ],
        required: true,
      },
    ],
  })
  .option({
    type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
    name: "supporters",
    description: "shows a list of the top petal supporters!",
  })
  .run(run);
