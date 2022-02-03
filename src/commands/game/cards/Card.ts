import axios from "axios";
import { getCard } from "../../../lib/graphql/query/GET_CARD";
import { searchCards } from "../../../lib/graphql/query/SEARCH_CARDS";
import { displayName } from "../../../lib/util/displayName";
import { formatCard } from "../../../lib/util/formatting/format";
import { Autocomplete, Run, SlashCommand } from "../../../struct/command";
import { Embed, ErrorEmbed } from "../../../struct/embed";

const run: Run = async ({ interaction, user, options }) => {
  const subcommand = options.options[0];
  const strCardId = subcommand.options![0].value as string;

  const cardId = parseInt(strCardId, 36);
  const card = await getCard(cardId);

  if (!card) {
    return interaction.createMessage({
      embeds: [new ErrorEmbed("please select a card from the dropdown!")],
    });
  }

  if (subcommand.name === "view") {
    const {
      data: { hash },
    } = (await axios.get(`${process.env.ONI_URL!}/hash`, {
      headers: { Authorization: process.env.ONI_SHARED_SECRET! },
      data: { id: card.prefab.id },
    })) as { data: { hash: string } };

    const { data } = (await axios.post(`${process.env.ONI_URL!}/card`, [
      {
        frame: `#${card.tint.toString(16)}`,
        name: card.prefab.character.name,
        id: card.id,
        character: `https://cdn.playpetal.com/p/${hash}.png`,
      },
    ])) as {
      data: { card: string };
    };

    const embed = new Embed()
      .setDescription(
        `${formatCard(card)}` + `\n*owned by ${displayName(card.owner)}*`
      )
      .setImage(`attachment://${card.id.toString(36)}.png`)
      .setFooter(
        `Card #${card.issue || 0} • #${card.tint.toString(16).toUpperCase()}`
      );

    return interaction.createFollowup({ embeds: [embed] }, [
      {
        file: Buffer.from(data.card, "base64"),
        name: `${card.id.toString(36)}.png`,
      },
    ]);
  }
};

const autocomplete: Autocomplete = async ({ interaction, user, options }) => {
  const focused = options.getFocused()!;
  const option = focused.options![0];

  let choices: { name: string; value: string }[] = [];

  if (option.name === "card") {
    const cards = await searchCards(option.value as string, user);

    choices = cards.map((c) => ({
      name: `${c.id.toString(36)} - ${
        c.prefab.group ? `${c.prefab.group.name} ` : ""
      }${c.prefab.subgroup ? ` ${c.prefab.subgroup.name} ` : ""}${
        c.prefab.character.name
      }`,
      value: c.id.toString(36),
    }));
  }

  return interaction.acknowledge(choices);
};

export default new SlashCommand("card")
  .desc("view a card")
  .run(run)
  .autocomplete(autocomplete)
  .option({
    type: "subcommand",
    name: "view",
    description: "shows information about a card",
    options: [
      {
        type: "string",
        name: "card",
        description: "the card you'd like to view",
        required: true,
        autocomplete: true,
      },
    ],
  })
  .option({
    type: "subcommand",
    name: "burn",
    description: "burns a card! will give you some petals in exchange",
    options: [
      {
        type: "string",
        name: "card",
        description: "the card you'd like to burn",
        required: true,
        autocomplete: true,
      },
    ],
  });
