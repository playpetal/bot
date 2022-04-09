import { Run } from "petal";
import { changeCardColor } from "../../../../../../lib/graphql/mutation/game/card/CHANGE_CARD_COLOR";
import { getCard } from "../../../../../../lib/graphql/query/GET_CARD";
import { getUser } from "../../../../../../lib/graphql/query/GET_USER";
import { getCardImage } from "../../../../../../lib/img";
import { emoji } from "../../../../../../lib/util/formatting/emoji";
import { strong } from "../../../../../../lib/util/formatting/strong";
import { Embed } from "../../../../../../struct/embed";
import { BotError } from "../../../../../../struct/error";

const run: Run = async ({ interaction, user, options }) => {
  const strCardId = options.getOption<string>("card")!;

  const cardId = parseInt(strCardId, 16);
  const card = await getCard(cardId);

  if (!card || card.owner === null)
    throw new BotError("please select a card from the dropdown!");

  if (card.owner.id !== user.id)
    throw new BotError("**hands off!**\nthat card doesn't belong to you.");

  const { premiumCurrency, discordId } = (await getUser({ id: user.id }))!;

  if (premiumCurrency < 1) {
    throw new BotError(
      `**woah there!**` + `\nyou need ${emoji.lily} ${strong(1)} to do that.`
    );
  }

  let hex = options.getOption<string>("color")!;
  if (!hex.match(/^#?[0-9A-F]{6}$/i))
    throw new BotError(
      "**woah there!**\nplease enter a valid hex code! they look like `#FFAACC`."
    );

  if (hex.startsWith("#")) hex = hex.slice(1);
  const color = parseInt(hex, 16);

  const _card = await changeCardColor(discordId, card.id, color);

  const image = await getCardImage(_card);

  const embed = new Embed()
    .setDescription(
      `${emoji.cards} **you use ${emoji.lily} 1 to brew a dye...**` +
        `\nyour card has been dyed to \`#${_card.tint
          .toString(16)
          .toUpperCase()}\`!`
    )
    .setThumbnail(`attachment://${card.id.toString(16)}.png`);

  return interaction.createFollowup({ embeds: [embed] }, [
    { file: image, name: `${card.id.toString(16)}.png` },
  ]);
};

export default run;
