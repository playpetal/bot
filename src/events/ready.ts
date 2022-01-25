import { bot } from "..";
import { processCommands } from "../lib/command";
import { Event } from "../struct/event";

const run = async function () {
  const isProduction = process.env.ENVIRONMENT === "PRODUCTION";

  const commands = bot.commands;
  const globalCommands = commands.filter((c) => !c.modOnly);
  const modCommands = commands.filter((c) => c.modOnly);

  const devServer = process.env.DEV_SERVER_ID!;
  const modServer = process.env.STAFF_SERVER_ID!;

  // process global slash commands
  await processCommands(globalCommands, isProduction ? undefined : devServer);
  // process mod-only slash commands
  await processCommands(modCommands, modServer);

  console.log(
    ` _,-._` +
      `\n/ \\_/ \\     petal v${process.env.npm_package_version}` +
      `\n>-(_)-<     running as ${bot.user.username}#${bot.user.discriminator}` +
      `\n\\_/ \\_/     loaded ${commands.length} commands (${globalCommands.length} global, ${modCommands.length} mod)` +
      `\n  \`-'`
  );
};

export default new Event(["ready"], run);
