import axios from "axios";
import { Card, SlashCommandOption } from "petal";
import { rollCards } from "../../../lib/graphql/mutation/ROLL_CARD";
import { getUser } from "../../../lib/graphql/query/GET_USER";
import { logger } from "../../../lib/logger";
import { emoji } from "../../../lib/util/formatting/emoji";
import { formatCard } from "../../../lib/util/formatting/format";
import { strong } from "../../../lib/util/formatting/strong";
import { Run, SlashCommand } from "../../../struct/command";
import { Embed, ErrorEmbed } from "../../../struct/embed";
import { BotError } from "../../../struct/error";

const run: Run = async function ({ interaction, user, options }) {
  let amount = options.getOption("amount") as number | undefined;

  if (!amount) amount = 1;

  if (!amount || isNaN(amount) || amount < 1 || amount > 10)
    throw new BotError(
      "**woah there!**\nyou can only roll up to 10 cards at once."
    );

  const gender = options.getOption("gender") as string | undefined;

  const cost = (gender ? 15 : 10) * amount;
  const { currency } = (await getUser({ id: user.id }))!;

  if (currency < cost) {
    throw new BotError(
      `**woah there!**` +
        `\nyou need ${emoji.petals} ${strong(cost)} to do that.`
    );
  }

  await interaction.createMessage({
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
    `${emoji.dice} you rolled **${counter}** for ${emoji.petals} ${strong(
      cost
    )} and got...` + `\n\n${humanFriendly.join("\n")}`
  );

  const collage = await getCollage(cards);
  const timeout = Math.max(0, 3000 - (Date.now() - now));

  setTimeout(async () => {
    await interaction.editOriginalMessage({
      embeds: [embed],
    });

    await interaction.editOriginalMessage(
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

async function getCollage(cards: Card[]) {
  const oniCards: {
    frame: string;
    name: string;
    id: number;
    character: string;
  }[] = [];

  for (let card of cards) {
    const {
      data: { hash },
    } = (await axios.get(`${process.env.ONI_URL!}/hash`, {
      headers: { Authorization: process.env.ONI_SHARED_SECRET! },
      data: { id: card.prefab.id },
    })) as { data: { hash: string } };

    oniCards.push({
      frame: `#${card.tint.toString(16)}`,
      name: card.prefab.character.name,
      id: card.id,
      character: `https://cdn.playpetal.com/p/${hash}.png`,
    });
  }

  try {
    const {
      data: { card },
    } = (await axios.post(`${process.env.ONI_URL!}/card`, oniCards)) as {
      data: { card: string };
    };

    return card;
  } catch (e) {
    console.log(e);
    return "";
  }
}

export default new SlashCommand("roll")
  .desc("rolls for a random card")
  .run(run)
  .option({
    type: "integer",
    name: "amount",
    description: "how many cards you want to roll",
    min_value: 1,
    max_value: 10,
  } as SlashCommandOption<"integer">)
  .option({
    type: "string",
    name: "gender",
    description: "only roll cards of this gender (costs more)",
    choices: [
      { name: "male", value: "MALE" },
      { name: "female", value: "FEMALE" },
    ],
  });
