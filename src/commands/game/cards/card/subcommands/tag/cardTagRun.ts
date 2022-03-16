import { Run } from "petal";
import { tagCard } from "../../../../../../lib/graphql/mutation/game/card/tag/TAG_CARD";
import { getTag } from "../../../../../../lib/graphql/query/game/card/tag/GET_TAG";
import { getCard } from "../../../../../../lib/graphql/query/GET_CARD";
import { formatCard } from "../../../../../../lib/util/formatting/format";
import { Embed } from "../../../../../../struct/embed";
import { BotError } from "../../../../../../struct/error";

const run: Run = async ({ interaction, user, options }) => {
  const strCardId = options.getOption<string>("card")!;
  const tagName = options.getOption<string>("tag")!;

  const cardId = parseInt(strCardId, 16);
  const card = await getCard(cardId);

  if (!card || card.owner === null)
    throw new BotError("please select a card from the dropdown!");

  const tag = await getTag(user.discordId, tagName);

  if (!tag)
    throw new BotError(
      "**woah there!**\nyou don't have a tag by that name. make sure your spelling is correct!"
    );

  const _card = await tagCard(user.discordId, card.id, tag.tag);

  const embed = new Embed().setDescription(
    `**success!**\nthe tag for ${formatCard(_card)} has been updated.`
  );

  return interaction.createFollowup({ embeds: [embed] });
};

export default run;
