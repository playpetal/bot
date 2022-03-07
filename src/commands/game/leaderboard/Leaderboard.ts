import { CONSTANTS } from "../../../lib/constants";
import { getGTSRewardLeaderboard } from "../../../lib/graphql/query/game/leaderboard/GET_GTS_REWARD_LEADERBOARD";
import { getGTSTimeLeaderboard } from "../../../lib/graphql/query/game/leaderboard/GET_GTS_TIME_LEADERBOARD";
import { getWordsRewardLeaderboard } from "../../../lib/graphql/query/game/leaderboard/GET_WORDS_REWARD_LEADERBOARD";
import { getWordsTimeLeaderboard } from "../../../lib/graphql/query/game/leaderboard/GET_WORDS_TIME_LEADERBOARD";
import { displayName } from "../../../lib/util/displayName";
import { emoji } from "../../../lib/util/formatting/emoji";
import { strong } from "../../../lib/util/formatting/strong";
import { Run, SlashCommand } from "../../../struct/command";
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
  const subcommandGroup = options.getSubcommandGroup()!;
  const subcommand = options.getSubcommand()!;

  let header: string = `${emoji.bloom} **unknown leaderboard**`;
  let body: string = `there's nothing here...?!`;

  if (subcommandGroup.name === "songs") {
    header = `**leaderboard - guess the song**`;

    if (subcommand.name === "time") {
      header += `\n${emoji.song} top 10 fastest guessers (average)`;

      const users = await getGTSTimeLeaderboard();
      const formatted = users.map(
        (u) => `${displayName(u.account)} [**${(u.time / 1000).toFixed(2)}s**]`
      );

      body = render(formatted);
    } else if (subcommand.name === "petals") {
      header += `\n${emoji.song} top 10 earners (petals)`;

      const users = await getGTSRewardLeaderboard("PETAL");
      const formatted = users.map(
        (u) => `${displayName(u.account)} [${emoji.petals} ${strong(u.value)}]`
      );

      body = render(formatted);
    } else if (subcommand.name === "lilies") {
      header += `\n${emoji.song} top 10 earners (lilies)`;

      const users = await getGTSRewardLeaderboard("LILY");
      const formatted = users.map(
        (u) => `${displayName(u.account)} [${emoji.lily} ${strong(u.value)}]`
      );

      body = render(formatted);
    } else if (subcommand.name === "cards") {
      header += `\n${emoji.song} top 10 earners (cards)`;

      const users = await getGTSRewardLeaderboard("CARD");
      const formatted = users.map(
        (u) => `${displayName(u.account)} [${emoji.cards} ${strong(u.value)}]`
      );

      body = render(formatted);
    }
  } else if (subcommandGroup.name === "petle") {
    header = `**leaderboard - petle**\n${emoji.bloom} `;

    if (subcommand.name === "time") {
      header += `top 10 fastest guessers (average)`;

      const users = await getWordsTimeLeaderboard();
      const formatted = users.map(
        (u) => `${displayName(u.account)} [**${(u.time / 1000).toFixed(2)}s**]`
      );

      body = render(formatted);
    } else if (subcommand.name === "petals") {
      header += `top 10 earners (petals)`;

      const users = await getWordsRewardLeaderboard("PETAL");
      const formatted = users.map(
        (u) => `${displayName(u.account)} [${emoji.petals} ${strong(u.value)}]`
      );

      body = render(formatted);
    } else if (subcommand.name === "lilies") {
      header += `top 10 earners (lilies)`;

      const users = await getWordsRewardLeaderboard("LILY");
      const formatted = users.map(
        (u) => `${displayName(u.account)} [${emoji.lily} ${strong(u.value)}]`
      );

      body = render(formatted);
    } else if (subcommand.name === "cards") {
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

export default new SlashCommand("leaderboard")
  .desc("views a leaderboard")
  .option({
    type: CONSTANTS.OPTION_TYPE.SUBCOMMAND_GROUP,
    name: "songs",
    description: "guess the song leaderboards",
    options: [
      {
        type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
        name: "time",
        description: "guess the song time leaderboards",
      },
      {
        type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
        name: "petals",
        description:
          "shows the players who have earned the most petals from GTS",
      },
      {
        type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
        name: "lilies",
        description:
          "shows the players who have earned the most lilies from GTS",
      },
      {
        type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
        name: "cards",
        description:
          "shows the players who have earned the most cards from GTS",
      },
    ],
  })
  .option({
    type: CONSTANTS.OPTION_TYPE.SUBCOMMAND_GROUP,
    name: "petle",
    description: "petle leaderboards",
    options: [
      {
        type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
        name: "time",
        description: "shows the players who finish petle games the fastest",
      },
      {
        type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
        name: "petals",
        description:
          "shows the players who have earned the most petals from petle",
      },
      {
        type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
        name: "lilies",
        description:
          "shows the players who have earned the most lilies from petle",
      },
      {
        type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
        name: "cards",
        description:
          "shows the players who have earned the most cards from petle",
      },
    ],
  })
  .run(run);
