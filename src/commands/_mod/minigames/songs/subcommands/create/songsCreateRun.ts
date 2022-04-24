import { Run } from "petal";
import { createSong } from "../../../../../../lib/graphql/mutation/game/minigame/gts/CREATE_SONG";
import { getLastRelease } from "../../../../../../lib/graphql/query/categorization/release/GET_LAST_RELEASE";
import { emoji } from "../../../../../../lib/util/formatting/emoji";
import { Embed } from "../../../../../../struct/embed";
import { BotError } from "../../../../../../struct/error";

const run: Run = async function run({ courier, user, options }) {
  const url = options.getOption<string>("url")!;

  try {
    new URL(url);
  } catch (e) {
    throw new BotError("**uh-oh!**\n`url` must be a valid URL :-(");
  }

  const title = options.getOption<string>("title")!;
  const groupIdStr = options.getOption<string>("group");
  const soloistIdStr = options.getOption<string>("soloist");
  let release = options.getOption<number>("release");

  const group = groupIdStr ? parseInt(groupIdStr, 10) : undefined;
  const soloist = soloistIdStr ? parseInt(soloistIdStr, 10) : undefined;

  if (!release) {
    const latest = await getLastRelease();
    if (latest) release = latest.id;
  }

  const song = await createSong(user.discordId, {
    title,
    url,
    groupId: group,
    soloistId: soloist,
    releaseId: release,
  });

  const embed = new Embed().setDescription(
    `Created a new song: ${emoji.song} **${song.title}** by ${
      song.group?.name || song.soloist?.name || "an unknown artist"
    } in release **${
      song.release.id
    }**.\nLink: https://cdn.playpetal.com/songs/${song.id}.m4a`
  );

  await courier.send({ embeds: [embed] });
  return;
};

export default run;
