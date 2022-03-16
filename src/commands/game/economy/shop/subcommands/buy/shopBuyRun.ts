import { Product, Run } from "petal";
import { bot } from "../../../../../..";
import { newTransaction } from "../../../../../../lib/graphql/mutation/shop/NEW_TRANSACTION";
import { getPayment } from "../../../../../../lib/graphql/query/shop/GET_PAYMENT";
import { getProducts } from "../../../../../../lib/graphql/query/shop/GET_PRODUCTS";
import { reachedPurchaseLimit } from "../../../../../../lib/graphql/query/shop/REACHED_PURCHASE_LIMIT";
import { emoji } from "../../../../../../lib/util/formatting/emoji";
import { Embed } from "../../../../../../struct/embed";
import { BotError } from "../../../../../../struct/error";

const run: Run = async function run({ interaction, user, options }) {
  const products: Product[] = await getProducts();

  const itemId = options.getOption<number>("item")!;
  const product = products.find((p) => p.id === itemId);

  if (!product)
    throw new BotError(
      `**please enter a valid item!**\nyou can use **\`/shop view\`** to view the shop.`
    );

  const reachedLimit = await reachedPurchaseLimit(user.discordId, product.id);

  if (reachedLimit)
    throw new BotError(
      "**hold up!**\nyou've reached the limit on purchases of that product!"
    );

  const payment = await newTransaction(user.discordId, product);

  const embed = new Embed().setDescription(
    `${emoji.bloom} **heads up!**\nyou're about to purchase **${
      product.name
    }** for **$${product.price.toFixed(
      2
    )}**.\n\n**important**: all purchases are **non-refundable**.\nif you encounter an error, please [contact us](https://discord.gg/petal)!\n\nif this all looks correct, [click here](${
      payment.url
    }) to make your purchase!`
  );

  await interaction.createMessage({ embeds: [embed] });

  let checks = 0;
  const interval = setInterval(async () => {
    if (checks >= 360) {
      clearInterval(interval);
      return;
    }

    checks++;

    const transaction = await getPayment(user.discordId, payment.paymentId);

    if (transaction.success) {
      const serverTime = (product.price / (83 / 730)).toFixed(2);

      const embed = new Embed().setDescription(
        `${emoji.bloom} **purchase complete!**\nyou purchased **${
          product.name
        }** for **$${product.price.toFixed(
          2
        )}**!\n\nthanks **so much** for supporting petal!\nyou just paid for **${serverTime} hours** of server time!`
      );

      try {
        await interaction.createMessage({ embeds: [embed] });
      } catch {
        const channel = await bot.getDMChannel(user.discordId);

        await channel.createMessage({ embeds: [embed] });
      }

      clearInterval(interval);
      return;
    }
  }, 10000);
  return;
};

export default run;
