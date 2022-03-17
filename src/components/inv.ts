import { InventoryOrder, InventorySort } from "petal";
import { getUserPartial } from "../lib/graphql/query/GET_USER_PARTIAL";
import { inventory } from "../lib/graphql/query/INVENTORY";
import { inventoryPage } from "../lib/graphql/query/INVENTORY_PAGE";
import { button, row } from "../lib/util/component";
import { displayName } from "../lib/util/displayName";
import { formatCard } from "../lib/util/formatting/format";
import { Component, RunComponent } from "../struct/component";
import { Embed } from "../struct/embed";
import { BotError } from "../struct/error";

const run: RunComponent = async function ({ interaction, user }) {
  const [_customId, data] = interaction.data.custom_id.split("?");
  const [_userId, _page, character, subgroup, group, _sort, _order, _tag] =
    data.split("&");

  const userId = parseInt(_userId, 10);

  if (user.id !== userId)
    throw new BotError("**woah there!**\nthose buttons aren't for you.");

  const page = parseInt(_page, 10);
  const sort = (_sort as InventorySort | "") || undefined;
  const order = (_order as InventoryOrder | "") || undefined;
  const tag = (_tag as string | "") || undefined;

  const _cards = await inventory(userId, page, {
    character,
    subgroup,
    group,
    sort,
    order,
    tag,
  });

  const strCards = _cards.map((c) => formatCard(c));

  const { max, cards } = await inventoryPage(userId, {
    character,
    subgroup,
    group,
    tag,
  });

  const target = (await getUserPartial({ id: userId }))!;

  const header = `viewing ${displayName(
    target
  )}'s inventory **(${cards.toLocaleString()} cards)**...`;

  const embed = new Embed().setDescription(
    `${header}\n\n${strCards.join("\n")}`
  );

  return interaction.editOriginalMessage({
    embeds: [embed],
    components: [
      row(
        button({
          customId: `inv?${userId}&${
            page - 1
          }&${character}&${subgroup}&${group}&${sort || ""}&${order || ""}&${
            tag || ""
          }`,
          style: "blue",
          emoji: "862984408076255252",
          disabled: page <= 1,
        }),
        button({
          customId: "page",
          style: "gray",
          label: `page ${page} of ${max}`,
          disabled: true,
        }),
        button({
          customId: `inv?${userId}&${
            page + 1
          }&${character}&${subgroup}&${group}&${sort || ""}&${order || ""}&${
            tag || ""
          }`,
          style: "blue",
          emoji: "862984408339578880",
          disabled: page >= max,
        })
      ),
    ],
  });
};

export default new Component("inv").run(run).autoack();
