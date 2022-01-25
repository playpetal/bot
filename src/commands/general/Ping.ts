import {
  CommandInteraction,
  Constants,
  InteractionDataOptionsWithValue,
} from "eris";
import { PartialUser } from "petal";
import { bot } from "../..";
import { getSong } from "../../lib/fun/ping/getSong";
import { displayName } from "../../lib/util/displayName";
import { SlashCommand } from "../../struct/command";
import { Embed } from "../../struct/embed";

const run = async function (
  interaction: CommandInteraction,
  user: PartialUser
) {
  const options = interaction.data.options as
    | InteractionDataOptionsWithValue[]
    | undefined;
  const isDevMode = !!options?.find(
    (o) => o.name === "dev" && o.value === true
  );

  let embed: Embed = new Embed();

  if (isDevMode) {
    const latency = bot.shards.get(0)?.latency!;

    const processTime = Date.now() - interaction.createdAt;

    embed.setDescription(
      `**latency**\nshard: **${
        isFinite(latency) ? `${latency}ms` : `no data`
      }**\ninteraction: **~${processTime}ms**`
    );
  } else {
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
  }

  await interaction.createMessage({ embeds: [embed] });
};

const command = new SlashCommand(
  "ping",
  "You can use this command to check if the bot is online!",
  run,
  [
    {
      name: "dev",
      description: "Shows advanced connection statistics",
      type: Constants.ApplicationCommandOptionTypes.BOOLEAN,
    },
  ]
);

export default command;
