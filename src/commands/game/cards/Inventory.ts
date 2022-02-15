import { inventory } from "../../../lib/graphql/query/INVENTORY";
import { inventoryPage } from "../../../lib/graphql/query/INVENTORY_PAGE";
import { searchCharacters } from "../../../lib/graphql/query/SEARCH_CHARACTERS";
import { searchGroups } from "../../../lib/graphql/query/SEARCH_GROUPS";
import { searchSubgroups } from "../../../lib/graphql/query/SEARCH_SUBGROUPS";
import { button, row } from "../../../lib/util/component";
import { displayName } from "../../../lib/util/displayName";
import { formatCard } from "../../../lib/util/formatting/format";
import { Autocomplete, Run, SlashCommand } from "../../../struct/command";
import { Embed } from "../../../struct/embed";

export const run: Run = async ({ interaction, user, options }) => {
  const character = options.getOption<string>("character");
  const subgroup = options.getOption<string>("subgroup");
  const group = options.getOption<string>("group");

  const _cards = await inventory(user.id, { character, subgroup, group });

  const formattedCards = _cards.map((c) => formatCard(c));

  if (formattedCards.length === 0) {
    const embed = new Embed().setDescription(
      "**you don't have any cards!**\nget some cards first with **/roll** :)"
    );
    return interaction.createMessage({ embeds: [embed] });
  }

  const { current, max, cards } = await inventoryPage(user.id, 0, {
    character,
    subgroup,
    group,
  });

  const embed = new Embed().setDescription(
    `viewing ${displayName(
      user
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
                customId: `inv?prev&${user.id}&${_cards[0].id}&${
                  character || ""
                }&${subgroup || ""}&${group || ""}`,
                style: "blue",
                emoji: "862984408076255252",
                disabled: true,
              }),
              button({
                customId: "page",
                label: `page ${current} of ${max}`,
                style: "gray",
                disabled: true,
              }),
              button({
                customId: `inv?next&${user.id}&${
                  _cards[_cards.length - 1].id
                }&${character || ""}&${subgroup || ""}&${group || ""}`,
                style: "blue",
                emoji: "862984408339578880",
              })
            ),
          ]
        : undefined,
  });
};

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
        : "No Birthday";
      return { name: `${s.name} (${creation})`, value: s.name };
    });
  } else if (focused.name === "group") {
    const groups = await searchGroups(focused.value as string);

    choices = groups.map((g) => {
      const creation = g.creation
        ? new Date(g.creation).toISOString().split("T")[0]
        : "No Birthday";
      return { name: `${g.name} (${creation})`, value: g.name };
    });
  }

  return interaction.acknowledge(choices);
};

export default new SlashCommand("inventory")
  .desc("shows you a list of your cards")
  .option({
    type: "string",
    name: "character",
    description: "show only this character",
    autocomplete: true,
  })
  .option({
    type: "string",
    name: "subgroup",
    description: "show only this subgroup",
    autocomplete: true,
  })
  .option({
    type: "string",
    name: "group",
    description: "show only this group",
    autocomplete: true,
  })
  .run(run)
  .autocomplete(autocomplete);
