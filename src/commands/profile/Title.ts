import { CONSTANTS } from "../../lib/constants";
import { setUserTitle } from "../../lib/graphql/mutation/SET_USER_TITLE";
import { getTitle } from "../../lib/graphql/query/GET_TITLE";
import { getUserTitle } from "../../lib/graphql/query/GET_USER_TITLE";
import { getUserTitles } from "../../lib/graphql/query/GET_USER_TITLES";
import { searchTitles } from "../../lib/graphql/query/SEARCH_TITLES";
import { displayName } from "../../lib/util/displayName";
import { emoji } from "../../lib/util/formatting/emoji";
import { strong } from "../../lib/util/formatting/strong";
import { Autocomplete, Run, SlashCommand } from "../../struct/command";
import { Embed, ErrorEmbed } from "../../struct/embed";

const run: Run = async ({ interaction, user, options }) => {
  const subcommand = options.getSubcommand()!;

  if (subcommand.name === "view") {
    const titleIdStr = options.getOption<string>("title")!;
    const titleId = parseInt(titleIdStr, 10);
    const title = await getTitle({ id: titleId });

    if (!title) {
      return await interaction.createMessage({
        embeds: [new ErrorEmbed("i couldn't find that title :(")],
      });
    }

    const embed = new Embed().setDescription(
      `${emoji.title} ${displayName({
        ...user,
        title: { title: title.title },
      })}` +
        `\n${emoji.user} *owned by ${strong(title.ownedCount)} players*` +
        `\n\n${title.description || "this title has no description!"}`
    );

    await interaction.createMessage({ embeds: [embed] });
  } else if (subcommand.name === "inventory") {
    const titles = await getUserTitles(user.id);

    const formatted = titles.map(
      (t) =>
        `${emoji.title} ${displayName({
          ...user,
          title: t.title,
        })}`
    );

    const embed = new Embed().setDescription(
      `${emoji.user} ${displayName(user)}'s titles\n\n` +
        (titles.length === 0
          ? "you don't have any titles :("
          : formatted.join("\n"))
    );

    await interaction.createMessage({ embeds: [embed] });
  } else if (subcommand.name === "use") {
    const titleIdStr = options.getOption<string>("title")!;
    const titleId = parseInt(titleIdStr, 10);

    if (isNaN(titleId))
      return await interaction.createMessage({
        embeds: [new ErrorEmbed("please select a title from the dropdown!")],
      });

    const title = await getUserTitle(titleId);

    if (!title)
      return await interaction.createMessage({
        embeds: [new ErrorEmbed("i couldn't find that title :(")],
      });

    if (title.account.id !== user.id)
      return await interaction.createMessage({
        embeds: [new ErrorEmbed("you don't own that title!")],
      });

    const _user = await setUserTitle(user.discordId, title.id);

    return interaction.createMessage({
      embeds: [
        new Embed().setDescription(
          `**title updated!**\nyour title has been set to ${displayName(
            _user
          )}!`
        ),
      ],
    });
  }
};

const autocomplete: Autocomplete = async ({ interaction, user, options }) => {
  const subcommand = options.getFocused()!;

  if (subcommand.name === "view") {
    const search = subcommand.options![0].value as string;
    const titles = await searchTitles(search);

    const choices = titles.map((t) => {
      {
        return {
          name: t.title.replace("%u", user.username),
          value: t.id.toString(),
        };
      }
    });

    return await interaction.acknowledge(choices);
  } else if (subcommand.name == "use") {
    const search = subcommand.options![0].value as string;
    const titles = await getUserTitles(user.id, search);

    const choices = titles.map((t) => {
      {
        return {
          name: t.title.title.replace("%u", user.username),
          value: t.id.toString(),
        };
      }
    });

    return await interaction.acknowledge(choices);
  }

  return await interaction.acknowledge([]);
};

export default new SlashCommand("title")
  .desc("shows info about a title")
  .run(run)
  .autocomplete(autocomplete)
  .option({
    type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
    name: "view",
    description: "shows information about a title",
    options: [
      {
        type: CONSTANTS.OPTION_TYPE.STRING,
        name: "title",
        description: "the title to view",
        required: true,
        autocomplete: true,
      },
    ],
  })
  .option({
    type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
    name: "inventory",
    description: "shows you a list of titles you own",
  })
  .option({
    type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
    name: "use",
    description: "sets a title as your active title",
    options: [
      {
        type: CONSTANTS.OPTION_TYPE.STRING,
        name: "title",
        description: "the title to set as your active title",
        required: true,
        autocomplete: true,
      },
    ],
  });
