import { bot } from "../../..";
import { getCardSuggestionEmbed } from "../../../lib/embed/meta/getCardSuggestionEmbed";
import { unclaimCardSuggestion } from "../../../lib/graphql/mutation/meta/card-suggestion/unclaimCardSuggestion";
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
    throw new BotError("**uh-oh!**\nthat suggestion is not assigned to you.");

  const _suggestion = await unclaimCardSuggestion(
    user.discordId,
    suggestion.id
  );

  const privateMessage = await bot.getMessage(
    process.env.PRIVATE_SUGGESTION_CHANNEL!,
    suggestion.privateMessageId
  );

  await privateMessage.edit({
    embeds: [getCardSuggestionEmbed(_suggestion, true)],
    components: [
      row(
        button({
          customId: `claim-card-suggestion?${_suggestion.id}`,
          style: "blue",
          label: "claim",
        }),
        button({
          customId: `delete-card-suggestion?${_suggestion.id}`,
          style: "red",
          label: "delete",
        })
      ),
    ],
  });

  const followupEmbed = new Embed().setDescription(
    `${emoji.check} **suggestion unclaimed!**\nyou are no longer responsible for **${suggestion.groupName} *${suggestion.subgroupName}***!`
  );

  await interaction.createFollowup({ embeds: [followupEmbed], flags: 64 });
  return;
};

export default new Component("unclaim-card-suggestion").run(run).autoack();
