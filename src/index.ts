require("dotenv").config();
import { Bot } from "./struct/client";

if (!process.env.ENVIRONMENT) process.env.ENVIRONMENT = "DEVELOPMENT";
if (!process.env.DISCORD_BOT_TOKEN)
  throw new Error("DISCORD_BOT_TOKEN must be specified in .env!");
if (!process.env.SHARED_SECRET)
  throw new Error("SHARED_SECRET must be specified in .env!");
if (!process.env.DEV_SERVER_ID)
  throw new Error("DEV_SERVER_ID must be specified in .env!");
if (!process.env.STAFF_SERVER_ID)
  throw new Error("STAFF_SERVER_ID must be specified in .env!");
if (!process.env.YUME_URL)
  throw new Error("YUME_URL must be specified in .env!");

export const bot = new Bot(process.env.DISCORD_BOT_TOKEN, {
  intents: ["guildMessages"],
  restMode: true,
});

bot.start().then(async () => await bot.connect());
