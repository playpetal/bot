import { getUserPartial } from "../lib/graphql/query/GET_USER_PARTIAL";
import { inventory } from "../lib/graphql/query/INVENTORY";
import { inventoryPage } from "../lib/graphql/query/INVENTORY_PAGE";
import { button, row } from "../lib/util/component";
import { displayName } from "../lib/util/displayName";
import { formatCard } from "../lib/util/formatting/format";
import { Component, RunComponent } from "../struct/component";
import { Embed } from "../struct/embed";

const run: RunComponent = async function ({ interaction }) {
  const [_customId, data] = interaction.data.custom_id.split("?");
  const [action, _userId, _cursor, character, subgroup, group] =
    data.split("&");

  const userId = parseInt(_userId, 10);
  const cursor = parseInt(_cursor, 10);
  const _cards = await inventory(userId, {
    next: action === "next" ? cursor : undefined,
    prev: action === "prev" ? cursor : undefined,
    character,
    subgroup,
    group,
  });

  if (action === "prev") _cards.reverse();
  const strCards = _cards.map((c) => formatCard(c));

  const { current, max, cards } = await inventoryPage(userId, _cards[0].id, {
    character,
    subgroup,
    group,
  });

  const user = (await getUserPartial({ id: userId }))!;

  const header = `viewing ${displayName(
    user
  )}'s inventory **(${cards.toLocaleString()} cards)**...`;

  const embed = new Embed().setDescription(
    `${header}\n\n${strCards.join("\n")}`
  );

  return interaction.editOriginalMessage({
    embeds: [embed],
    components: [
      row(
        button({
          customId: `inv?prev&${userId}&${_cards[0].id}&${character}&${subgroup}&${group}`,
          style: "blue",
          emoji: "862984408076255252",
          disabled: current <= 1,
        }),
        button({
          customId: "page",
          style: "gray",
          label: `page ${current} of ${max}`,
          disabled: true,
        }),
        button({
          customId: `inv?next&${userId}&${
            _cards[_cards.length - 1].id
          }&${character}&${subgroup}&${group}`,
          style: "blue",
          emoji: "862984408339578880",
          disabled: current >= max,
        })
      ),
    ],
  });
};

export default new Component("inv").run(run);
