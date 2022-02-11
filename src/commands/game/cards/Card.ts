import { burnCard } from "../../../lib/graphql/mutation/game/BURN_CARD";
import { getCard } from "../../../lib/graphql/query/GET_CARD";
import { searchCards } from "../../../lib/graphql/query/SEARCH_CARDS";
import { getCardImage } from "../../../lib/img";
import { displayName } from "../../../lib/util/displayName";
import { emoji } from "../../../lib/util/formatting/emoji";
import { formatCard } from "../../../lib/util/formatting/format";
import { strong } from "../../../lib/util/formatting/strong";
import { Autocomplete, Run, SlashCommand } from "../../../struct/command";
import { Embed } from "../../../struct/embed";
import { BotError } from "../../../struct/error";

const run: Run = async ({ interaction, user, options }) => {
  const subcommand = options.options[0];
  const strCardId = subcommand.options![0].value as string;

  const cardId = parseInt(strCardId, 16);
  const card = await getCard(cardId);

  if (!card || card.owner === null)
    throw new BotError("please select a card from the dropdown!");

  if (subcommand.name === "view") {
    const image = await getCardImage(card);

    const embed = new Embed()
      .setDescription(
        `${formatCard(card)}` + `\n*owned by ${displayName(card.owner)}*`
      )
      .setImage(`attachment://${card.id.toString(16)}.png`)
      .setFooter(
        `Card #${card.issue || 0} • #${card.tint.toString(16).toUpperCase()}`
      );

    return interaction.createFollowup({ embeds: [embed] }, [
      {
        file: image,
        name: `${card.id.toString(16)}.png`,
      },
    ]);
  } else if (subcommand.name === "burn") {
    if (card.owner.id !== user.id)
      throw new BotError("**hands off!**\nthat card doesn't belong to you.");

    const reward =
      (["SEED", "SPROUT", "BUD", "FLOWER", "BLOOM"].indexOf(card.quality) + 1) *
      5;

    await burnCard(card.id, user.discordId);

    const image = await getCardImage(card);

    const embed = new Embed()
      .setDescription(
        `${emoji.burn} **the card crackles as it turns to dust...**` +
          `\nin its ashes you find ${emoji.petals} ${strong(reward)}!`
      )
      .setThumbnail(`attachment://${card.id.toString(16)}.png`);

    return interaction.createFollowup({ embeds: [embed] }, [
      { file: image, name: `${card.id.toString(16)}.png` },
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
      name: `${c.id.toString(16)} - ${
        c.prefab.group ? `${c.prefab.group.name} ` : ""
      }${c.prefab.subgroup ? ` ${c.prefab.subgroup.name} ` : ""}${
        c.prefab.character.name
      }`,
      value: c.id.toString(16),
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
