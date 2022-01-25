import Eris, {
  AutocompleteInteraction,
  CommandInteraction,
  InteractionDataOptionsWithValue,
} from "eris";
import { PartialUser } from "petal";
import { getTitle } from "../../../lib/graphql/query/GET_TITLE";
import { searchTitles } from "../../../lib/graphql/query/SEARCH_TITLES";
import { displayName } from "../../../lib/util/displayName";
import { SlashCommand } from "../../../struct/command";
import { Embed } from "../../../struct/embed";

const run = async function (
  interaction: CommandInteraction,
  user: PartialUser
) {
  const options = interaction.data.options as InteractionDataOptionsWithValue[];

  const titleString = options.find((o) => o.name === "title")!.value as string;

  const title = (await getTitle(undefined, titleString))[0];

  const embed = new Embed().setDescription(
    `<:title:930918843537309776> ${displayName({
      username: user.username,
      title: { title: { title: title.title } },
    })}\n${
      title.description || "This title has no description!"
    }\n\nThis title is owned by <:user:930918872473796648> **${
      title.ownedCount
    }**.`
  );

  await interaction.createMessage({ embeds: [embed] });
};

async function runAutocomplete(
  interaction: AutocompleteInteraction,
  user: PartialUser
) {
  const options = interaction.data.options as {
    value: string;
    type: 3;
    name: string;
    focused?: boolean;
  }[];

  const focused = options.find((o) => o.focused)!;
  const titles = await searchTitles(focused.value);

  const choices = titles.map((t) => {
    return { name: t.title.replace("%u", user.username), value: t.title };
  });

  await interaction.acknowledge(choices);
}

const command = new SlashCommand(
  "title",
  "shows info about a title",
  run,
  [
    {
      type: Eris.Constants.ApplicationCommandOptionTypes.STRING,
      name: "title",
      description: "the search query for the title you want to see",
      required: true,
      autocomplete: true,
    },
  ],
  runAutocomplete
);

export default command;
