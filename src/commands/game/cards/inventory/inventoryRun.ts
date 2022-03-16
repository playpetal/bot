import { Run } from "petal";
import { getUserPartial } from "../../../../lib/graphql/query/GET_USER_PARTIAL";
import { inventory } from "../../../../lib/graphql/query/INVENTORY";
import { inventoryPage } from "../../../../lib/graphql/query/INVENTORY_PAGE";
import { row, button } from "../../../../lib/util/component";
import { displayName } from "../../../../lib/util/displayName";
import { trimBirthday } from "../../../../lib/util/formatting/birthday";
import { emoji } from "../../../../lib/util/formatting/emoji";
import { formatCard } from "../../../../lib/util/formatting/format";
import {
  parseInventorySort,
  parseInventoryOrder,
} from "../../../../lib/util/options/parseInventoryOptions";
import { Embed } from "../../../../struct/embed";
import { BotError } from "../../../../struct/error";

export const run: Run = async ({ interaction, user, options }) => {
  const character = trimBirthday(options.getOption<string>("character"));
  const subgroup = trimBirthday(options.getOption<string>("subgroup"));
  const group = trimBirthday(options.getOption<string>("group"));
  const targetId = options.getOption<string>("user");
  const sort = parseInventorySort(options);
  const order = parseInventoryOrder(options);
  const tag = options.getOption<string>("tag");

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
    tag,
  });

  const formattedCards = _cards.map((c) => formatCard(c));

  if (formattedCards.length === 0) {
    const hasFilters = Boolean(character || subgroup || group || tag);

    let desc = "";

    if (hasFilters) {
      desc = `**${
        target.id === user.id ? "you have" : "that user has"
      } no cards matching those filters!**\ntry using some different filters?`;
    } else {
      desc = `**${
        target.id === user.id ? "you don't" : "that user doesn't"
      } have any cards yet!**\n${
        target.id === user.id ? "you" : "they"
      } can earn ${emoji.petals} **petals** or ${
        emoji.cards
      } **cards** by playing minigames!`;
    }

    const embed = new Embed().setDescription(desc);

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

export default run;
