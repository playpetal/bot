import { Card, Run } from "petal";
import { getCard } from "../../../../../lib/graphql/query/GET_CARD";
import { searchCards } from "../../../../../lib/graphql/query/SEARCH_CARDS";

export const cardUpgradeAutocomplete: Run = async ({
  courier,
  user,
  options,
}) => {
  const focused = options.getFocused()!;
  const cardId = options.getOption<string>("card");

  let cards: Card[] = [];

  if (focused.name === "fodder" && cardId) {
    const card = await getCard(parseInt(cardId, 16));

    if (card) {
      cards = await searchCards(focused.value as string, user, {
        prefabId: card.prefab.id,
        minQuality: card.quality,
        maxQuality: card.quality,
        exclude: card.id,
      });
    } else cards = await searchCards(focused.value as string, user);
  } else cards = await searchCards(focused.value as string, user);

  const choices = cards.map((c) => ({
    name: `${c.id.toString(16)} - ${
      c.prefab.group ? `${c.prefab.group.name} ` : ""
    }${c.prefab.subgroup ? ` ${c.prefab.subgroup.name} ` : ""}${
      c.prefab.character.name
    }`,
    value: c.id.toString(16),
  }));

  await courier.send(choices);
  return;
};
