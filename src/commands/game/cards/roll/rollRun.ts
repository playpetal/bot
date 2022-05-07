import { Run } from "petal";
import { rollCards } from "../../../../lib/graphql/mutation/ROLL_CARD";
import { getUser } from "../../../../lib/graphql/query/GET_USER";
import { getCollage } from "../../../../lib/img";
import { logger } from "../../../../lib/logger";
import { emoji } from "../../../../lib/util/formatting/emoji";
import { emphasis } from "../../../../lib/util/formatting/emphasis";
import { formatCard } from "../../../../lib/util/formatting/format";
import { Embed } from "../../../../struct/embed";
import { BotError } from "../../../../struct/error";

const run: Run = async function ({ courier, user, options }) {
  let amount = options.getOption<number>("amount");

  if (!amount) amount = 1;

  if (!amount || isNaN(amount) || amount < 1 || amount > 10)
    throw new BotError(
      "**woah there!**\nyou can only roll up to 10 cards at once."
    );

  const gender = options.getOption<string>("gender");

  const cost = (gender ? 15 : 10) * amount;
  const { currency } = (await getUser({ id: user.id }))!;

  if (currency < cost) {
    throw new BotError(
      `**woah there!**` +
        `\nyou need ${emoji.petals} ${emphasis(cost)} to do that.`
    );
  }

  await courier.send({
    embeds: [
      new Embed().setDescription(
        `${emoji.dice} **rolling your dice...** good luck!`
      ),
    ],
  });

  const cards = await rollCards(
    user.discordId,
    amount,
    gender as "MALE" | "FEMALE" | undefined
  );

  logger.info(
    JSON.stringify({ user, currency, cost, gender, amount: amount, cards })
  );

  const now = Date.now();

  const isOnce = amount === 1;
  const counter = isOnce ? "once" : `${amount} times`;

  const humanFriendly = cards.map((c) => formatCard(c));

  const embed = new Embed().setDescription(
    `${emoji.dice} you rolled ${emphasis(counter)} for ${
      emoji.petals
    } ${emphasis(cost)} and got...` + `\n\n${humanFriendly.join("\n")}`
  );

  const collage = await getCollage(cards);
  const timeout = Math.max(0, 3000 - (Date.now() - now));

  setTimeout(async () => {
    await courier.edit({
      embeds: [embed],
    });

    await courier.edit(
      {
        embeds: [embed.setImage("attachment://collage.png")],
      },
      [
        {
          file: Buffer.from(collage, "base64"),
          name: "collage.png",
        },
      ]
    );
  }, timeout);
};

export default run;
