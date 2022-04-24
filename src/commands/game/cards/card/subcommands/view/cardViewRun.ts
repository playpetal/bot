import { Run } from "petal";
import { getCard } from "../../../../../../lib/graphql/query/GET_CARD";
import { getCardImage } from "../../../../../../lib/img";
import { displayName } from "../../../../../../lib/util/displayName";
import { formatCard } from "../../../../../../lib/util/formatting/format";
import { Embed } from "../../../../../../struct/embed";
import { BotError } from "../../../../../../struct/error";

const run: Run = async ({ courier, options }) => {
  const strCardId = options.getOption<string>("card")!;

  const cardId = parseInt(strCardId, 16);
  const card = await getCard(cardId);

  if (!card || card.owner === null)
    throw new BotError("please select a card from the dropdown!");

  const image = await getCardImage(card);

  const embed = new Embed()
    .setDescription(
      `${formatCard(card, { issue: false })}` +
        `\n*owned by ${displayName(card.owner)}*`
    )
    .setImage(`attachment://${card.id.toString(16)}.png`)
    .setFooter(
      `Card #${card.issue || 0} • #${card.tint
        .toString(16)
        .toUpperCase()
        .padStart(6, "0")}`
    );

  return courier.send({ embeds: [embed] }, [
    {
      file: image,
      name: `${card.id.toString(16)}.png`,
    },
  ]);
};

export default run;
