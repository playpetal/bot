import { slashCommand } from "../../../lib/command";
import { CONSTANTS } from "../../../lib/constants";
import { getUserPartial } from "../../../lib/graphql/query/GET_USER_PARTIAL";
import { inventory } from "../../../lib/graphql/query/INVENTORY";
import { inventoryPage } from "../../../lib/graphql/query/INVENTORY_PAGE";
import { searchCharacters } from "../../../lib/graphql/query/SEARCH_CHARACTERS";
import { searchGroups } from "../../../lib/graphql/query/SEARCH_GROUPS";
import { searchSubgroups } from "../../../lib/graphql/query/SEARCH_SUBGROUPS";
import { button, row } from "../../../lib/util/component";
import { displayName } from "../../../lib/util/displayName";
import { formatCard } from "../../../lib/util/formatting/format";
import {
  parseInventoryOrder,
  parseInventorySort,
} from "../../../lib/util/options/parseInventoryOptions";
import { Autocomplete, Run } from "../../../struct/command";
import { Embed } from "../../../struct/embed";
import { BotError } from "../../../struct/error";

export const run: Run = async ({ interaction, user, options }) => {
  const character = trimBirthday(options.getOption<string>("character"));
  const subgroup = trimBirthday(options.getOption<string>("subgroup"));
  const group = trimBirthday(options.getOption<string>("group"));
  const targetId = options.getOption<string>("user");
  const sort = parseInventorySort(options);
  const order = parseInventoryOrder(options);

  let target = user;

  if (targetId) {
    const _target = await getUserPartial({ discordId: targetId });

    if (!_target) throw new BotError("that user hasn't registered yet!");
    target = _target;
  }

  const page = 1;

  const _cards = await inventory(target.id, page, {
    character,
    subgroup,
    group,
    sort,
    order,
  });

  const formattedCards = _cards.map((c) => formatCard(c));

  if (formattedCards.length === 0) {
    const embed = new Embed().setDescription(
      "**you don't have any cards!**\nget some cards first with **/roll** :)"
    );
    return interaction.createMessage({ embeds: [embed] });
  }

  const { max, cards } = await inventoryPage(target.id, {
    character,
    subgroup,
    group,
  });

  const embed = new Embed().setDescription(
    `viewing ${displayName(
      target
    )}'s inventory **(${cards.toLocaleString()} cards)**...\n\n ${formattedCards.join(
      "\n"
    )}`
  );

  return interaction.createMessage({
    embeds: [embed],
    components:
      cards > 10
        ? [
            row(
              button({
                customId: `inv?${target.id}&${page - 1}&${character || ""}&${
                  subgroup || ""
                }&${group || ""}&${sort || ""}&${order || ""}`,
                style: "blue",
                emoji: "862984408076255252",
                disabled: true,
              }),
              button({
                customId: "page",
                label: `page ${page} of ${max}`,
                style: "gray",
                disabled: true,
              }),
              button({
                customId: `inv?${target.id}&${page + 1}&${character || ""}&${
                  subgroup || ""
                }&${group || ""}&${sort || ""}&${order || ""}`,
                style: "blue",
                emoji: "862984408339578880",
              })
            ),
          ]
        : undefined,
  });
};

function trimBirthday(str?: string): string | undefined {
  if (!str) return str;
  return str
    .replace(/\(\d\d\d\d-\d\d-\d\d\)|\(No Birthday\)|\(No Date\)/gi, "")
    .trim();
}

const autocomplete: Autocomplete = async ({ interaction, user, options }) => {
  const focused = options.getFocused()!;
  let choices: { name: string; value: string }[] = [];

  if (focused.name === "character") {
    const characters = await searchCharacters(focused.value as string);

    choices = characters.map((c) => {
      const birthday = c.birthday
        ? new Date(c.birthday).toISOString().split("T")[0]
        : "No Birthday";
      return { name: `${c.name} (${birthday})`, value: c.name };
    });
  } else if (focused.name === "subgroup") {
    const subgroups = await searchSubgroups(focused.value as string);

    choices = subgroups.map((s) => {
      const creation = s.creation
        ? new Date(s.creation).toISOString().split("T")[0]
        : "No Date";
      return { name: `${s.name} (${creation})`, value: s.name };
    });
  } else if (focused.name === "group") {
    const groups = await searchGroups(focused.value as string);

    choices = groups.map((g) => {
      const creation = g.creation
        ? new Date(g.creation).toISOString().split("T")[0]
        : "No Date";
      return { name: `${g.name} (${creation})`, value: g.name };
    });
  }

  return interaction.acknowledge(choices);
};

export default slashCommand("inventory")
  .desc("shows you a list of your cards")
  .option({
    type: CONSTANTS.OPTION_TYPE.USER,
    name: "user",
    description: "the user whose inventory you'd like to view",
  })
  .option({
    type: CONSTANTS.OPTION_TYPE.STRING,
    name: "character",
    description: "show only this character",
    autocomplete: true,
  })
  .option({
    type: CONSTANTS.OPTION_TYPE.STRING,
    name: "subgroup",
    description: "show only this subgroup",
    autocomplete: true,
  })
  .option({
    type: CONSTANTS.OPTION_TYPE.STRING,
    name: "group",
    description: "show only this group",
    autocomplete: true,
  })
  .option({
    type: CONSTANTS.OPTION_TYPE.STRING,
    name: "sort",
    description: "what property you want to sort your cards by",
    choices: [
      { name: "character", value: "character" },
      { name: "code", value: "code" },
      { name: "group", value: "group" },
      { name: "issue", value: "issue" },
      { name: "stage", value: "stage" },
      { name: "subgroup", value: "subgroup" },
    ],
  })
  .option({
    type: CONSTANTS.OPTION_TYPE.STRING,
    name: "order",
    description: "the order you want to sort by (default is ascending)",
    choices: [
      { name: "ascending", value: "ascending" },
      { name: "descending", value: "descending" },
    ],
  })
  .run(run)
  .autocomplete(autocomplete);
