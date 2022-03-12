import { AutocompleteChoice } from "petal";
import { slashCommand } from "../../lib/command";
import { CONSTANTS } from "../../lib/constants";
import { TitleError } from "../../lib/error/title-error";
import { setUserTitle } from "../../lib/graphql/mutation/SET_USER_TITLE";
import { getUserTitles } from "../../lib/graphql/query/GET_USER_TITLES";
import { searchTitles } from "../../lib/graphql/query/SEARCH_TITLES";
import { displayName } from "../../lib/util/displayName";
import { emoji } from "../../lib/util/formatting/emoji";
import { strong } from "../../lib/util/formatting/strong";
import { Autocomplete, Run } from "../../struct/command";
import { Embed } from "../../struct/embed";

const run: Run = async ({ interaction, user, options }) => {
  const subcommand = options.getSubcommand()!;

  if (subcommand.name === "view") {
    const titleName = options
      .getOption<string>("title")!
      .replace("<username>", "");

    const title = (await searchTitles(titleName))[0];

    if (!title) throw TitleError.TitleNotFound;

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
      `viewing ${displayName(user)}'s titles *(${
        titles.length
      } owned)...*\n\n` +
        (titles.length === 0
          ? "you don't have any titles :("
          : formatted.join("\n"))
    );

    await interaction.createMessage({ embeds: [embed] });
  } else if (subcommand.name === "use") {
    const titleName = options
      .getOption<string>("title")!
      .replace("<username>", "");

    const title = (await getUserTitles(user.id, titleName))[0];

    if (!title) throw TitleError.TitleNotFound;

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
  const subcommand = options.getSubcommand()!;
  let choices: AutocompleteChoice[] = [];

  if (subcommand.name === "view") {
    const search = options.getOption<string>("title")!;
    const titles = await searchTitles(search);

    choices = titles.map(({ title }) => {
      {
        return {
          name: title.replace("%u", "<username>"),
          value: title.replace("%u", "").trim(),
        };
      }
    });

    return await interaction.acknowledge(choices);
  } else if (subcommand.name == "use") {
    const search = options.getOption<string>("title")!;
    const titles = await getUserTitles(user.id, search);

    choices = titles.map(({ title: { title } }) => {
      {
        return {
          name: title.replace("%u", "<username>"),
          value: title.replace("%u", "").trim(),
        };
      }
    });
  }

  return await interaction.acknowledge(choices);
};

export default slashCommand("title")
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
