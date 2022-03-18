import { ApolloError } from "@apollo/client/core";
import { Run } from "petal";
import { gift } from "../../../../lib/graphql/mutation/game/economy/GIFT";
import { getUser } from "../../../../lib/graphql/query/GET_USER";
import { displayName } from "../../../../lib/util/displayName";
import { emoji } from "../../../../lib/util/formatting/emoji";
import { strong } from "../../../../lib/util/formatting/strong";
import { Embed } from "../../../../struct/embed";
import { BotError } from "../../../../struct/error";

export const giftRun: Run = async ({ courier, options, user }) => {
  const targetId = options.getOption<string>("user")!;
  const cardIds = options.getOption<string>("cards");
  const petals = options.getOption<number>("petals");
  const lilies = options.getOption<number>("lilies");

  if (!cardIds && !petals && !lilies)
    throw new BotError("**hold up!**\nyou have to gift *something*... :\\");

  const target = await getUser({ discordId: targetId });

  if (!target)
    throw new BotError(
      "**hold up!**\nthat user doesn't exist, or hasn't registered yet."
    );

  const cards: number[] = [];
  if (cardIds) {
    const ids = cardIds.split(" ");

    for (let strId of ids) {
      const id = parseInt(strId, 16);
      if (isNaN(id))
        throw new BotError(`**hold up!**\n\`${id}\` is not a valid card.`);

      cards.push(id);
    }
  }

  try {
    await gift({
      discordId: user.discordId,
      recipientId: target.id,
      cards,
      petals,
      lilies,
    });

    const gifts: string[] = [];

    if (petals) {
      gifts.push(`${emoji.petals} ${strong(petals)}`);
    }

    if (lilies) {
      gifts.push(`${emoji.lily} ${strong(lilies)}`);
    }

    if (cards.length > 0) {
      gifts.push(`**${cards.length}** card${cards.length === 1 ? "" : "s"}`);
    }

    const embed = new Embed().setDescription(
      `**gift complete!**\nyou gave ${gifts.join(" and ")} to ${displayName(
        target
      )}.`
    );

    await courier.send({ embeds: [embed] });
  } catch (e) {
    if (e instanceof ApolloError && e.graphQLErrors.length > 0) {
      const errors = e.graphQLErrors;
      throw new BotError(`**hold up!**\n${errors[0].message}`);
    } else throw e;
  }
};
