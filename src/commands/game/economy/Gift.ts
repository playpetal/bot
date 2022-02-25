import { ApolloError } from "@apollo/client/core";
import { gift } from "../../../lib/graphql/mutation/game/economy/GIFT";
import { getUser } from "../../../lib/graphql/query/GET_USER";
import { displayName } from "../../../lib/util/displayName";
import { emoji } from "../../../lib/util/formatting/emoji";
import { strong } from "../../../lib/util/formatting/strong";
import { Run, SlashCommand } from "../../../struct/command";
import { Embed } from "../../../struct/embed";
import { BotError } from "../../../struct/error";

const run: Run = async ({ interaction, options, user }) => {
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

    await interaction.createMessage({ embeds: [embed] });
  } catch (e) {
    if (e instanceof ApolloError && e.graphQLErrors.length > 0) {
      const errors = e.graphQLErrors;
      throw new BotError(`**hold up!**\n${errors[0].message}`);
    } else throw e;
  }
};

export default new SlashCommand("gift")
  .desc("gift cards or petals to another player!")
  .option({
    type: "user",
    name: "user",
    description: "the user you'd like to gift to",
    required: true,
  })
  .option({
    type: "string",
    name: "cards",
    description: "the cards, separated by spaces, you'd like to gift",
  })
  .option({
    type: "integer",
    name: "petals",
    description: "the amount of petals you'd like to gift",
    min_value: 1,
  })
  .option({
    type: "integer",
    name: "lilies",
    description: "the amount of lilies you'd like to gift",
    min_value: 1,
  })
  .run(run);
