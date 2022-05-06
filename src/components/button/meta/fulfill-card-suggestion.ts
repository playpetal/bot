import { bot } from "../../..";
import { getCardSuggestionEmbed } from "../../../lib/embed/meta/getCardSuggestionEmbed";
import { fulfillCardSuggestion } from "../../../lib/graphql/mutation/meta/card-suggestion/fulfillCardSuggestion";
import { getCardSuggestion } from "../../../lib/graphql/query/meta/card-suggestion/getCardSuggestion";
import { button, row } from "../../../lib/util/component";
import { emoji } from "../../../lib/util/formatting/emoji";
import { Component, RunComponent } from "../../../struct/component";
import { Embed } from "../../../struct/embed";
import { BotError } from "../../../struct/error";

const run: RunComponent = async ({ interaction, user }) => {
  const suggestionId = parseInt(interaction.data.custom_id.split("?")[1], 10);

  const suggestion = await getCardSuggestion({ id: suggestionId });
  if (!suggestion)
    throw new BotError("**uh-oh!**\nthat suggestion doesn't exist anymore.");

  if (suggestion.fulfilledBy?.id !== user.id)
    throw new BotError("**uh-oh!**\nthat suggestion isn't yours to complete.");

  const _suggestion = await fulfillCardSuggestion(
    user.discordId,
    suggestion.id
  );

  try {
    const privateMessage = await bot.getMessage(
      process.env.PRIVATE_SUGGESTION_CHANNEL!,
      suggestion.privateMessageId
    );

    await privateMessage.edit({
      embeds: [getCardSuggestionEmbed(_suggestion, true)],
      components: [
        row(
          button({
            customId: `unfulfill-card-suggestion?${_suggestion.id}`,
            style: "gray",
            label: "uncomplete",
          })
        ),
      ],
    });
  } catch {}
  const publicMessage = await bot.getMessage(
    process.env.PUBLIC_SUGGESTION_CHANNEL!,
    suggestion.publicMessageId
  );

  await publicMessage.edit({
    embeds: [getCardSuggestionEmbed(_suggestion)],
    components: [
      row(
        button({
          customId: `vote-card-suggestion?${_suggestion.id}`,
          style: "blue",
          label: "vote up",
          disabled: true,
        })
      ),
    ],
  });
  try {
  } catch {}

  const followupEmbed = new Embed().setDescription(
    `${emoji.check} **suggestion completed!**\nif this is in error, feel free to uncomplete!`
  );

  await interaction.createFollowup({ embeds: [followupEmbed], flags: 64 });
  return;
};

export default new Component("fulfill-card-suggestion").run(run).autoack();
