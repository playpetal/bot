import { SlashCommandOption } from "petal";
import { bot } from "../..";
import { getSong } from "../../lib/fun/ping/getSong";
import { displayName } from "../../lib/util/displayName";
import { SlashCommand, Run } from "../../struct/command";
import { Embed } from "../../struct/embed";

const run: Run = async function ({ interaction, user, options }) {
  const isDevMode = options.getOption<boolean>("dev");

  let embed: Embed = new Embed();

  if (isDevMode) {
    const latency = bot.shards.get(0)?.latency!;

    const processTime = Date.now() - interaction.createdAt;

    embed.setDescription(
      `**latency**\nshard: **${
        isFinite(latency) ? `${latency}ms` : `no data`
      }**\ninteraction: **~${processTime}ms**`
    );

    return await interaction.createMessage({ embeds: [embed] });
  }

  const song = getSong();
  let links: string[] = [];

  if (song.spotify) {
    links.push(`[[spotify]](${song.spotify})`);
  }
  if (song.youtube) {
    links.push(`[[youtube music]](${song.youtube})`);
  }
  if (song.apple) {
    links.push(`[[apple music]](${song.apple})`);
  }

  embed
    .setDescription(
      `hey there, ${displayName(user)}!` +
        `\nif you're seeing this, it means the bot is connected to Discord!` +
        `\n\n*looking for something to listen to?*\ntry **${song.artist} - ${song.title}**!` +
        (links.length > 0 ? `\n${links.join(" - ")}` : ``)
    )
    .setImage("https://cdn.playpetal.com/banners/default.png");

  await interaction.createMessage({ embeds: [embed] });
};

export default new SlashCommand("ping")
  .desc("you can use this command to check if petal is online!")
  .option({
    type: "boolean",
    name: "dev",
    description: "shows advanced connection stats",
  } as SlashCommandOption<"boolean">)
  .run(run);
