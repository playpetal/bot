import { getUser } from "../../../lib/graphql/query/GET_USER";
import { inventory } from "../../../lib/graphql/query/INVENTORY";
import { inventoryPage } from "../../../lib/graphql/query/INVENTORY_PAGE";
import { button, row } from "../../../lib/util/component";
import { displayName } from "../../../lib/util/displayName";
import { formatCard } from "../../../lib/util/formatting/format";
import { Run, SlashCommand } from "../../../struct/command";
import { Embed } from "../../../struct/embed";

export const run: Run = async ({ interaction, user }) => {
  const _cards = await inventory(user.id, {});
  const {
    stats: { cardCount },
  } = (await getUser({ id: user.id }))!;

  const cards = _cards.map((c) => formatCard(c));

  if (cards.length === 0) {
    const embed = new Embed().setDescription(
      "**you don't have any cards!**\nget some cards first with **/roll** :)"
    );
    return interaction.createMessage({ embeds: [embed] });
  }

  const embed = new Embed().setDescription(
    `viewing ${displayName(
      user
    )}'s inventory **(${cardCount.toLocaleString()} cards)**...\n\n ${cards.join(
      "\n"
    )}`
  );

  const { current, max } = await inventoryPage(user.id, 0);

  return interaction.createMessage({
    embeds: [embed],
    components:
      cardCount > 10
        ? [
            row(
              button({
                customId: `inv?prev&${user.id}&${_cards[0].id}`,
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
                customId: `inv?next&${user.id}&${_cards[_cards.length - 1].id}`,
                style: "blue",
                emoji: "862984408339578880",
              })
            ),
          ]
        : undefined,
  });
};

export default new SlashCommand("inventory")
  .desc("shows you a list of your cards")
  .run(run);
