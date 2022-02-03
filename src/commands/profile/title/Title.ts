import { InteractionOption, SlashCommandOption } from "petal";
import { getTitle } from "../../../lib/graphql/query/GET_TITLE";
import { getUserTitles } from "../../../lib/graphql/query/GET_USER_TITLES";
import { searchTitles } from "../../../lib/graphql/query/SEARCH_TITLES";
import { displayName } from "../../../lib/util/displayName";
import { emoji } from "../../../lib/util/formatting/emoji";
import { strong } from "../../../lib/util/formatting/strong";
import { Autocomplete, Run, SlashCommand } from "../../../struct/command";
import { Embed, ErrorEmbed } from "../../../struct/embed";

const run: Run = async ({ interaction, user, options }) => {
  const subcommand = options.options[0] as InteractionOption<boolean>;

  if (subcommand.name === "view") {
    const id = parseInt(subcommand.options![0].value as string, 10);
    const title = await getTitle(id);

    if (!title) {
      return await interaction.createMessage({
        embeds: [new ErrorEmbed("i couldn't find that title :(")],
      });
    }

    const embed = new Embed().setDescription(
      `${emoji.title} ${displayName({
        ...user,
        title: { title: { title: title.title } },
      })}` +
        `\n${emoji.user} *owned by ${strong(title.ownedCount)} players*` +
        `\n${title.description || "this title has no description!"}`
    );

    await interaction.createMessage({ embeds: [embed] });
  } else if (subcommand.name === "inventory") {
    const titles = await getUserTitles(user.id);

    const formatted = titles.map(
      (t) =>
        `${emoji.title} ${displayName({
          ...user,
          title: t,
        })}`
    );

    const embed = new Embed().setDescription(
      `${emoji.user} ${displayName(user)}'s titles\n\n` +
        (titles.length === 0
          ? "you don't have any titles :("
          : formatted.join("\n"))
    );

    await interaction.createMessage({ embeds: [embed] });
  }
};

const autocomplete: Autocomplete = async ({ interaction, user, options }) => {
  const focused = options.getFocused();

  if (focused?.name === "view") {
    const search = focused.options![0].value as string;
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
  }

  return await interaction.acknowledge([]);
};

export default new SlashCommand("title")
  .desc("shows info about a title")
  .run(run)
  .autocomplete(autocomplete)
  .option({
    type: "subcommand",
    name: "view",
    description: "shows information about a title",
    options: [
      {
        type: "string",
        name: "title",
        description: "the title to view",
        required: true,
        autocomplete: true,
      } as SlashCommandOption<"string">,
    ],
  } as SlashCommandOption<"subcommand">)
  .option({
    type: "subcommand",
    name: "inventory",
    description: "shows you a list of titles you own",
  } as SlashCommandOption<"subcommand">);
