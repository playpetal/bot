import { Run } from "petal";
import { burnCard } from "../../../../../../lib/graphql/mutation/game/BURN_CARD";
import { getCard } from "../../../../../../lib/graphql/query/GET_CARD";
import { getCardImage } from "../../../../../../lib/img";
import { emoji } from "../../../../../../lib/util/formatting/emoji";
import { strong } from "../../../../../../lib/util/formatting/strong";
import { Embed } from "../../../../../../struct/embed";
import { BotError } from "../../../../../../struct/error";

const run: Run = async ({ courier, user, options }) => {
  const strCardId = options.getOption<string>("card")!;

  const cardId = parseInt(strCardId, 16);
  const card = await getCard(cardId);

  if (!card || card.owner === null)
    throw new BotError("please select a card from the dropdown!");

  if (card.owner.id !== user.id)
    throw new BotError("**hands off!**\nthat card doesn't belong to you.");

  const reward =
    (["SEED", "SPROUT", "BUD", "FLOWER", "BLOOM"].indexOf(card.quality) + 1) *
    3;

  await burnCard(card.id, user.discordId);

  let image: Buffer | undefined;

  try {
    image = await getCardImage(card);
  } catch (e) {}

  const embed = new Embed()
    .setDescription(
      `${emoji.burn} **the card crackles as it turns to dust...**` +
        `\nin its ashes you find ${emoji.petals} ${strong(reward)}!`
    )
    .setThumbnail(`attachment://${card.id.toString(16)}.png`);

  return courier.send(
    { embeds: [embed] },
    image ? [{ file: image, name: `${card.id.toString(16)}.png` }] : undefined
  );
};

export default run;
