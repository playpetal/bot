import { Run } from "petal";
import { upgradeCard } from "../../../../../../lib/graphql/mutation/game/card/upgradeCard";
import { getCard } from "../../../../../../lib/graphql/query/GET_CARD";
import { getCardImage } from "../../../../../../lib/img";
import { formatCard } from "../../../../../../lib/util/formatting/format";
import { Embed } from "../../../../../../struct/embed";
import { BotError } from "../../../../../../struct/error";

export const cardUpgradeRun: Run = async ({ interaction, options, user }) => {
  const strCardId = options.getOption<string>("card")?.split("-")[0].trim();
  const strFodderCardId = options
    .getOption<string>("fodder")
    ?.split("-")[0]
    .trim();

  if (!strCardId)
    throw new BotError("**uh-oh!**\nplease select a card to upgrade!");

  if (!strFodderCardId)
    throw new BotError("**uh-oh!**\nplease select a card to use as fodder!");

  const cardId = parseInt(strCardId, 16);
  const fodderCardId = parseInt(strFodderCardId, 16);

  if (isNaN(cardId))
    throw new BotError("**uh-oh!**\nplease select a card to upgrade!");

  if (isNaN(fodderCardId))
    throw new BotError("**uh-oh!**\nplease select a card to use as fodder!");

  const card = await getCard(cardId);

  if (!card)
    throw new BotError(
      "**uh-oh!**\ni couldn't find the card you're trying to upgrade!\nplease make sure you didn't make a typo!"
    );

  if (card.quality === "BLOOM")
    throw new BotError(
      "**woah there!**\nthe card you're trying to upgrade is already maxed out!"
    );

  if (card.owner?.id !== user.id)
    throw new BotError(
      "**woah there!**\nthe card you're trying to upgrade doesn't belong to you!"
    );

  const fodderCard = await getCard(fodderCardId);

  if (!fodderCard)
    throw new BotError(
      "**uh-oh!**\ni couldn't find the card you're trying to use as fodder!\nplease make sure you didn't make a typo!"
    );

  if (fodderCard.owner?.id !== user.id)
    throw new BotError(
      "**woah there!**\nthe card you're trying to use as fodder doesn't belong to you!"
    );

  if (card.id === fodderCard.id)
    throw new BotError(
      "**woah there!**\nyou can't use the card you're upgrading as fodder!"
    );

  if (card.prefab.id !== fodderCard.prefab.id)
    throw new BotError(
      "**woah there!**\nthe fodder card must be the same base card as the card to upgrade!"
    );

  const _card = await upgradeCard(user.discordId, card.id, fodderCard.id);
  const image = await getCardImage(_card);

  const embed = new Embed()
    .setDescription(
      `**upgrade successful!**\n${formatCard(_card, {
        issue: false,
      })} has been upgraded to **${_card.quality}**!`
    )
    .setThumbnail(`attachment://${_card.id.toString(16)}.png`);

  await interaction.createFollowup({ embeds: [embed] }, [
    {
      file: image,
      name: `${_card.id.toString(16)}.png`,
    },
  ]);

  return;
};
