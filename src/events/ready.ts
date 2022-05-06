import { bot } from "..";
import { announcer } from "../lib/announcer/announcer";
import { processCommands } from "../lib/command";
import { logger } from "../lib/logger";
import { Event } from "../struct/event";

const run = async function () {
  const isProduction = process.env.ENVIRONMENT === "PRODUCTION";

  const commands = bot.commands;
  const globalCommands = commands.filter(
    (c) => !c.isModOnly() && !c.isMainOnly()
  );
  const modCommands = commands.filter((c) => c.isModOnly());
  const mainCommands = commands.filter((c) => c.isMainOnly());

  const devServer = process.env.DEV_SERVER_ID!;
  const modServer = process.env.STAFF_SERVER_ID!;
  const mainServer = process.env.MAIN_SERVER_ID!;

  try {
    // process global slash commands
    await processCommands(globalCommands, isProduction ? undefined : devServer);
    // process mod-only slash commands
    await processCommands(modCommands, modServer);
    // process main-only slash commands
    await processCommands(mainCommands, mainServer);
  } catch (e) {
    logger.error(`failed to process commands: ${e}`);
  }

  console.log(
    ` _,-._` +
      `\n/ \\_/ \\     petal v${process.env.npm_package_version}` +
      `\n>-(_)-<     running as ${bot.user.username}#${bot.user.discriminator}` +
      `\n\\_/ \\_/     loaded ${commands.length} commands (${globalCommands.length} global, ${modCommands.length} mod, ${mainCommands.length} main)` +
      `\n  \`-'`
  );

  await announcer.beginPolling();
};

export default new Event(["ready"], run);
