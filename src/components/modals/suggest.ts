import { CardSuggestion } from "petal";
import { bot } from "../..";
import { getCardSuggestionEmbed } from "../../lib/embed/meta/getCardSuggestionEmbed";
import { createCardSuggestion } from "../../lib/graphql/mutation/meta/card-suggestion/createCardSuggestion";
import { getCardSuggestion } from "../../lib/graphql/query/meta/card-suggestion/getCardSuggestion";
import { button, row } from "../../lib/util/component";
import { emoji } from "../../lib/util/formatting/emoji";
import { Embed } from "../../struct/embed";
import { BotError } from "../../struct/error";
import { Modal, RunModal } from "../../struct/modal";

const a: RunModal = async ({ interaction, user }) => {
  const groupName = interaction.data.components[0].components[0].value;
  const subgroupName = interaction.data.components[1].components[0].value;

  const suggestionExists = await getCardSuggestion({ groupName, subgroupName });
  if (suggestionExists) {
    throw new BotError(
      `**that subgroup has already been suggested!**\nyou can vote it up [here](https://discord.com/channels/${process
        .env.MAIN_SERVER_ID!}/${process.env.PUBLIC_SUGGESTION_CHANNEL!}/${
        suggestionExists.publicMessageId
      }) to boost it!`
    );
  }

  const mockSuggestion: CardSuggestion = {
    id: 0,
    groupName,
    subgroupName,
    suggestedBy: user,
    fulfilledBy: null,
    fulfilled: false,
    votes: [{ account: user, id: 0 }],
    publicMessageId: "",
    privateMessageId: "",
  };

  const publicMessage = await bot.createMessage(
    process.env.PUBLIC_SUGGESTION_CHANNEL!,
    { embeds: [getCardSuggestionEmbed(mockSuggestion)] }
  );

  const privateMessage = await bot.createMessage(
    process.env.PRIVATE_SUGGESTION_CHANNEL!,
    { embeds: [getCardSuggestionEmbed(mockSuggestion, true)] }
  );

  let suggestion: CardSuggestion;

  try {
    suggestion = await createCardSuggestion(
      user.discordId,
      groupName,
      subgroupName,
      publicMessage.id,
      privateMessage.id
    );
  } catch (e) {
    if (e instanceof BotError) {
      e.message = e.message.replace(
        "%C",
        `<#${process.env.PUBLIC_SUGGESTION_CHANNEL!}>`
      );
    }

    await publicMessage.delete();
    await privateMessage.delete();

    throw e;
  }

  await publicMessage.edit({
    embeds: [getCardSuggestionEmbed(suggestion)],
    components: [
      row(
        button({
          customId: `vote-card-suggestion?${suggestion.id}`,
          style: "blue",
          label: "vote up",
        })
      ),
    ],
  });

  await privateMessage.edit({
    embeds: [getCardSuggestionEmbed(suggestion, true)],
    components: [
      row(
        button({
          customId: `claim-card-suggestion?${suggestion.id}`,
          style: "blue",
          label: "claim",
        }),
        button({
          customId: `delete-card-suggestion?${suggestion.id}`,
          style: "red",
          label: "delete",
        })
      ),
    ],
  });

  const privateEmbed = new Embed().setDescription(
    `${emoji.check} **your suggestion has been submitted!**\n**${
      suggestion.groupName
    } *${suggestion.subgroupName}*** has **${suggestion.votes.length}** vote${
      suggestion.votes.length === 1 ? "" : "s"
    }!`
  );

  await interaction.createFollowup({ embeds: [privateEmbed], flags: 64 });
  return;
};

export default new Modal("suggest").run(a);
