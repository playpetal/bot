import axios from "axios";
import {
  CommandInteraction,
  Constants,
  InteractionDataOptionsWithValue,
} from "eris";
import { writeFile } from "fs/promises";
import { PartialUser } from "petal";
import { Maybe } from "../../../lib/graphql";
import { rollCards } from "../../../lib/graphql/mutation/ROLL_CARD";
import { getUser } from "../../../lib/graphql/query/GET_USER";
import { prefabCreationManager } from "../../../lib/mod/createCard";
import { SlashCommand } from "../../../struct/command";
import { Embed, ErrorEmbed } from "../../../struct/embed";

const run = async function (
  interaction: CommandInteraction,
  user: PartialUser
) {
  const options = interaction.data.options as
    | InteractionDataOptionsWithValue[]
    | undefined;

  let amount = options?.find((o) => o.name === "amount")?.value as
    | number
    | undefined;

  if (amount === undefined) amount = 1;

  if (isNaN(amount) || amount < 1 || amount > 10) {
    return await interaction.createMessage({
      embeds: [new ErrorEmbed("`amount` must be a number between 1 and 10!")],
      flags: 64,
    });
  }

  const gender = options?.find((o) => o.name === "gender")?.value as
    | string
    | undefined;

  let cost = 10;

  if (gender) {
    if (!["MALE", "FEMALE"].includes(gender))
      return await interaction.createMessage({
        embeds: [
          new ErrorEmbed("`gender` must be either **male** or **female**!"),
        ],
      });

    cost = 15;
  }

  cost *= amount;

  const { currency } = (await getUser({ id: user.id }))!;
  if (currency < cost) {
    return await interaction.createMessage({
      embeds: [
        new ErrorEmbed(
          `you need <:petals:930918815225741383> **${cost}** to do that, but you only have <:petals:930918815225741383> **${currency}** :(`
        ),
      ],
    });
  }

  await interaction.createFollowup({
    content: "",
    embeds: [
      new Embed().setDescription(
        `<:dice:938013692593860639> **rolling your dice...** good luck!`
      ),
    ],
  });

  const cards = await rollCards(
    interaction.member!.user.id,
    amount,
    gender as "MALE" | "FEMALE" | undefined
  );

  const now = Date.now();

  const isOnce = amount === 1;
  const counter = isOnce ? "once" : `${amount} times`;

  const humanFriendly = cards.map((c) => {
    let str = `${emojis[c.quality]}`;

    // if (c.prefab.group) str += ` **${c.prefab.group.name}**`;
    if (c.prefab.subgroup) str += ` **${c.prefab.subgroup.name}**`;

    str += ` ${c.prefab.character.name}`;

    return str;
  });

  const embed = new Embed().setDescription(
    `<:dice:938013692593860639> you rolled **${counter}** for <:petals:930918815225741383> **${cost}** and got...` +
      `\n\n${humanFriendly.join("\n")}`
  );

  const collage = await getCollage(cards);
  const timeout = Math.max(0, 3000 - (Date.now() - now));

  await writeFile("./file.png", Buffer.from(collage, "base64"));

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

const emojis = {
  SEED: "<:seed:937994849553113088>",
  SPROUT: "<:sprout:937994864606457856>",
  BUD: "<:bud:937994864866492416>",
  FLOWER: "<:flower:937994864837136414>",
  BLOOM: "<:bloom:917578760449060995>",
};

async function getCollage(
  cards: {
    id: number;
    prefab: {
      id: number;
      group: Maybe<{
        name: string;
      }>;
      subgroup: Maybe<{
        name: string;
      }>;
      character: {
        name: string;
      };
    };
    issue: number;
    quality: "SEED" | "SPROUT";
    tint: number;
  }[]
) {
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

const command = new SlashCommand("roll", "rolls for a random card", run, [
  {
    type: Constants.ApplicationCommandOptionTypes.INTEGER,
    name: "amount",
    description: "how many cards you want to roll",
    // @ts-ignore - eris doesn't like this for some reason but it's valid according to discord docs.
    max_value: 10,
    // @ts-ignore - see above
    min_value: 1,
  },
  {
    type: Constants.ApplicationCommandOptionTypes.STRING,
    name: "gender",
    description: "only roll cards of this gender (costs more)",
    choices: [
      { name: "male", value: "MALE" },
      { name: "female", value: "FEMALE" },
    ],
  },
]);

export default command;
