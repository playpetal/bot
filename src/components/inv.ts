import { ComponentInteraction } from "eris";
import { getUserPartial } from "../lib/graphql/query/GET_USER_PARTIAL";
import { inventory } from "../lib/graphql/query/INVENTORY";
import { inventoryPage } from "../lib/graphql/query/INVENTORY_PAGE";
import { displayName } from "../lib/util/displayName";
import { formatCard } from "../lib/util/formatting/format";
import { Component } from "../struct/component";
import { Embed } from "../struct/embed";

const run = async (interaction: ComponentInteraction) => {
  const [_customId, data] = interaction.data.custom_id.split("?");
  const [action, _userId, _cursor] = data.split("&");

  const userId = parseInt(_userId, 10);
  const cursor = parseInt(_cursor, 10);
  const _cards = await inventory(userId, {
    next: action === "next" ? cursor : undefined,
    prev: action === "prev" ? cursor : undefined,
  });

  if (action === "prev") _cards.reverse();
  const strCards = _cards.map((c) => formatCard(c));

  const { current, max, cards } = await inventoryPage(userId, _cards[0].id);

  const user = (await getUserPartial(undefined, userId))!;

  const header = `viewing ${displayName(
    user
  )}'s inventory **(${cards.toLocaleString()} cards)**...`;

  const embed = new Embed().setDescription(
    `${header}\n\n${strCards.join("\n")}`
  );

  return interaction.editOriginalMessage({
    embeds: [embed],
    components: [
      {
        type: 1,
        components: [
          {
            type: 2,
            emoji: { id: "862984408076255252" },
            custom_id: `inv?prev&${userId}&${_cards[0].id}`,
            style: 1,
            disabled: current <= 1,
          },
          {
            type: 2,
            label: `page ${current} of ${max}`,
            custom_id: "page",
            style: 2,
            disabled: true,
          },
          {
            type: 2,
            emoji: { id: "862984408339578880" },
            custom_id: `inv?next&${userId}&${_cards[_cards.length - 1].id}`,
            style: 1,
            disabled: current >= max,
          },
        ],
      },
    ],
  });
};

export default new Component("inv", run);
