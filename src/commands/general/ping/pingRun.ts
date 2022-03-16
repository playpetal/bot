import axios from "axios";
import { Run } from "petal";
import { bot } from "../../..";
import { getSong } from "../../../lib/fun/ping/getSong";
import { getUserPartial } from "../../../lib/graphql/query/GET_USER_PARTIAL";
import { displayName } from "../../../lib/util/displayName";
import { Embed } from "../../../struct/embed";

const run: Run = async function ({ interaction, user, options }) {
  const isDevMode = options.getOption<boolean>("dev");

  let embed: Embed = new Embed();

  if (isDevMode) {
    const latency = bot.shards.get(0)?.latency!;
    const processTime = Date.now() - interaction.createdAt;

    let now = Date.now();
    let oniLatency: number | undefined;
    try {
      const res = await axios.get(`${process.env.ONI_URL!}/health`);
      if (res.status === 200) oniLatency = Date.now() - now;
    } catch (e) {}

    now = Date.now();
    let yureLatency: number | undefined;
    try {
      const res = await axios.get(`${process.env.YURE_URL!}/health`);
      if (res.status === 200) yureLatency = Date.now() - now;
    } catch (e) {}

    now = Date.now();
    let yumeLatency: number | undefined;
    try {
      await getUserPartial({ id: user.id });
      yumeLatency = Date.now() - now;
    } catch (e) {}

    embed
      .addField({
        name: "discord",
        value:
          `[shard latency](https://discord.com/developers/docs/topics/gateway#sharding): **${
            isFinite(latency) ? `${latency}ms` : "no data..."
          }**` +
          `\n[interaction response](https://discord.com/developers/docs/interactions/receiving-and-responding): **~${processTime}ms**`,
        inline: true,
      })
      .addField({
        name: "services",
        value:
          `yume response: **${
            yumeLatency ? `${yumeLatency}ms` : "error"
          }**\n||yume is petal's api service||` +
          `\noni response: **${
            oniLatency ? `${oniLatency}ms` : "error"
          }**\n||oni is petal's image generation service||` +
          `\nyure response: **${
            yureLatency ? `${yureLatency}ms` : "ERROR"
          }**\n||yure is petal's video generation service||`,
        inline: true,
      });

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

export default run;
