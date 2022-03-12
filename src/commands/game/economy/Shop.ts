import { Product } from "petal";
import { bot } from "../../..";
import { slashCommand } from "../../../lib/command";
import { CONSTANTS } from "../../../lib/constants";
import { newTransaction } from "../../../lib/graphql/mutation/shop/NEW_TRANSACTION";
import { getPayment } from "../../../lib/graphql/query/shop/GET_PAYMENT";
import { getProducts } from "../../../lib/graphql/query/shop/GET_PRODUCTS";
import { emoji } from "../../../lib/util/formatting/emoji";
import { Run } from "../../../struct/command";
import { Embed } from "../../../struct/embed";
import { BotError } from "../../../struct/error";

const run: Run = async function run({ interaction, user, options }) {
  const subcommand = options.getSubcommand()!;
  const products: Product[] = await getProducts();

  if (subcommand.name === "view") {
    if (products.length === 0) {
      const embed = new Embed().setDescription(
        `**there are no items available at the moment!**\ncheck back later, and join https://discord.gg/petal for updates.`
      );

      await interaction.createMessage({ embeds: [embed] });
      return;
    }

    let shop = `${emoji.bloom} **welcome to the shop!**\nyou can purchase items here and support petal's development!\n`;

    for (let product of products) {
      shop += `\n\`/shop buy ${product.id}\` **${
        product.name
      }** ($${product.price.toFixed(2)})`;
    }

    const embed = new Embed().setDescription(shop).setFooter(``);

    await interaction.createMessage({ embeds: [embed] });
    return;
  } else if (subcommand.name === "buy") {
    const itemId = options.getOption<number>("item")!;
    const product = products.find((p) => p.id === itemId);

    if (!product)
      throw new BotError(
        `**please enter a valid item!**\nyou can use **\`/shop view\`** to view the shop.`
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
  }
};

export default slashCommand("shop")
  .desc("support petal!")
  .run(run)
  .option({
    type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
    name: "view",
    description: "shows a list of purchasable items!",
  })
  .option({
    type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
    name: "buy",
    description: "purchase an item!",
    options: [
      {
        type: CONSTANTS.OPTION_TYPE.INTEGER,
        name: "item",
        description: "the option you'd like to purchase!",
        required: true,
      },
    ],
    ephemeral: true,
  });
