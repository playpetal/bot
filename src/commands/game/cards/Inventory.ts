import { getUser } from "../../../lib/graphql/query/GET_USER";
import { inventory } from "../../../lib/graphql/query/INVENTORY";
import { inventoryPage } from "../../../lib/graphql/query/INVENTORY_PAGE";
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
            {
              type: 1,
              components: [
                {
                  type: 2,
                  emoji: { id: "862984408076255252" },
                  custom_id: `inv?prev&${user.id}&${_cards[0].id}`,
                  style: 1,
                  disabled: true,
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
                  custom_id: `inv?next&${user.id}&${
                    _cards[_cards.length - 1].id
                  }`,
                  style: 1,
                },
              ],
            },
          ]
        : undefined,
  });
};

export default new SlashCommand("inventory")
  .desc("shows you a list of your cards")
  .run(run);
