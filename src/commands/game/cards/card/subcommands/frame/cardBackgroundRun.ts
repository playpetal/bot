import { Run } from "petal";
import { setFrame } from "../../../../../../lib/graphql/mutation/game/card/SET_FRAME";
import { getCard } from "../../../../../../lib/graphql/query/GET_CARD";
import { getUser } from "../../../../../../lib/graphql/query/GET_USER";
import { getCardImage, uploadImage } from "../../../../../../lib/img";
import { logger } from "../../../../../../lib/logger";
import { emoji } from "../../../../../../lib/util/formatting/emoji";
import { strong } from "../../../../../../lib/util/formatting/strong";
import { Embed } from "../../../../../../struct/embed";
import { BotError } from "../../../../../../struct/error";

const run: Run = async function cardFrameRun({ interaction, user, options }) {
  const strCardId = options.getOption<string>("card")!;

  const cardId = parseInt(strCardId, 16);
  const card = await getCard(cardId);

  if (!card || card.owner === null)
    throw new BotError("please select a card from the dropdown!");

  if (card.owner.id !== user.id)
    throw new BotError("**hands off!**\nthat card doesn't belong to you.");

  const { premiumCurrency, discordId } = (await getUser({ id: user.id }))!;

  if (premiumCurrency < 100) {
    throw new BotError(
      `**woah there!**` + `\nyou need ${emoji.lily} ${strong(100)} to do that.`
    );
  }

  const attachmentId = options.getOption<string>("background")!;

  // @ts-ignore
  const url = interaction.data.resolved?.attachments[attachmentId]
    .url as string;

  if (!url.endsWith(".png") && !url.endsWith(".jpg"))
    throw new BotError(
      "**woah there!**\nthe attachment must be a `.png` or `.jpg` file!"
    );

  try {
    await uploadImage(url, card.id, "frame");
  } catch (e) {
    logger.error(e);
    throw new BotError(
      "**uh-oh!**\nan error occurred while uploading the background to the server.\n**no** lilies have been deducted from your account."
    );
  }

  const _card = await setFrame(discordId, card.id);

  let image = Buffer.alloc(0);

  try {
    image = await getCardImage(_card);
  } catch (e) {
    logger.error(e);
  }

  const embed = new Embed()
    .setDescription(
      `${emoji.cards} **you use ${emoji.lily} 100 to make a background...**` +
        `\nyour card's background has been changed!`
    )
    .setThumbnail(`attachment://${card.id.toString(16)}.png`);

  return interaction.createFollowup({ embeds: [embed] }, [
    { file: image, name: `${card.id.toString(16)}.png` },
  ]);
};

export default run;
