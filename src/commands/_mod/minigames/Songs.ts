import { slashCommand } from "../../../lib/command";
import { CONSTANTS } from "../../../lib/constants";
import { createSong } from "../../../lib/graphql/mutation/game/minigame/gts/CREATE_SONG";
import { getLastRelease } from "../../../lib/graphql/query/categorization/release/GET_LAST_RELEASE";
import { searchCharacters } from "../../../lib/graphql/query/SEARCH_CHARACTERS";
import { searchGroups } from "../../../lib/graphql/query/SEARCH_GROUPS";
import { emoji } from "../../../lib/util/formatting/emoji";
import { Autocomplete, Run } from "../../../struct/command";
import { Embed } from "../../../struct/embed";
import { BotError } from "../../../struct/error";

const run: Run = async function run({ interaction, user, options }) {
  const subcommand = options.getSubcommand()!;

  if (subcommand.name === "create") {
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

    await interaction.createMessage({ embeds: [embed] });
    return;
  }
};

const autocomplete: Autocomplete = async function autocomplete({
  interaction,
  options,
}) {
  const focused = options.getFocused()!;
  let choices: { name: string; value: string }[] = [];

  const nested = focused.options!.find((o) => o.focused)!;

  if (nested.name === "soloist") {
    const search = await searchCharacters(nested.value as string);

    choices = search.map((c) => {
      const birthday = c.birthday
        ? new Date(c.birthday).toISOString().split("T")[0]
        : "No Birthday";
      return { name: `${c.name} (${birthday})`, value: c.id.toString() };
    });
  } else if (nested.name === "group") {
    const search = await searchGroups(nested.value as string);

    choices = search.map((c) => {
      const date = c.creation
        ? new Date(c.creation).toISOString().split("T")[0]
        : "No Date";
      return { name: `${c.name} (${date})`, value: c.id.toString() };
    });
  }

  return interaction.acknowledge(choices);
};

export default slashCommand("songs")
  .desc("song management tools")
  .modOnly(true)
  .option({
    type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
    name: "create",
    description: "create a new song",
    options: [
      {
        type: CONSTANTS.OPTION_TYPE.STRING,
        name: "url",
        description: "the url to the video to rip the audio from",
        required: true,
      },
      {
        type: CONSTANTS.OPTION_TYPE.STRING,
        name: "title",
        description: "the title of the song",
        required: true,
      },
      {
        type: CONSTANTS.OPTION_TYPE.STRING,
        name: "group",
        description: "the group the song is made by (optional)",
        autocomplete: true,
      },
      {
        type: CONSTANTS.OPTION_TYPE.STRING,
        name: "soloist",
        description: "the soloist the song is made by (optional)",
        autocomplete: true,
      },
      {
        type: CONSTANTS.OPTION_TYPE.NUMBER,
        name: "release",
        description:
          "the release the song is bound to (will be auto-set to latest undroppable release)",
      },
    ],
  })
  .run(run)
  .autocomplete(autocomplete);
