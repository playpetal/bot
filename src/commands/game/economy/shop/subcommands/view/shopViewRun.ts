import { Product, Run } from "petal";
import { getProducts } from "../../../../../../lib/graphql/query/shop/GET_PRODUCTS";
import { reachedPurchaseLimit } from "../../../../../../lib/graphql/query/shop/REACHED_PURCHASE_LIMIT";
import { emoji } from "../../../../../../lib/util/formatting/emoji";
import { Embed } from "../../../../../../struct/embed";

const run: Run = async function run({ interaction, user }) {
  const products: Product[] = await getProducts();

  if (products.length === 0) {
    const embed = new Embed().setDescription(
      `**there are no items available at the moment!**\ncheck back later, and join https://discord.gg/petal for updates.`
    );

    await interaction.createMessage({ embeds: [embed] });
    return;
  }

  let shop = `${emoji.bloom} **welcome to the shop!**\nyou can purchase items here and support petal's development!\n`;

  for (let product of products) {
    const reachedLimit = await reachedPurchaseLimit(user.discordId, product.id);

    const str = `\n\`/shop buy ${product.id}\` **${
      product.name
    }** ($${product.price.toFixed(2)})`;

    if (reachedLimit) {
      shop += `~~${str}~~ **Purchased!**`;
    } else shop += str;
  }

  const embed = new Embed().setDescription(shop).setFooter(``);

  await interaction.createMessage({ embeds: [embed] });
  return;
};

export default run;
