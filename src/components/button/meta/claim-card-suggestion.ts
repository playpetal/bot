import { bot } from "../../..";
import { getCardSuggestionEmbed } from "../../../lib/embed/meta/getCardSuggestionEmbed";
import { claimCardSuggestion } from "../../../lib/graphql/mutation/meta/card-suggestion/claimCardSuggestion";
import { getCardSuggestion } from "../../../lib/graphql/query/meta/card-suggestion/getCardSuggestion";
import { button, row } from "../../../lib/util/component";
import { emoji } from "../../../lib/util/formatting/emoji";
import { emphasis } from "../../../lib/util/formatting/emphasis";
import { Component, RunComponent } from "../../../struct/component";
import { Embed } from "../../../struct/embed";
import { BotError } from "../../../struct/error";

const run: RunComponent = async ({ interaction, user }) => {
  const suggestionId = parseInt(interaction.data.custom_id.split("?")[1], 10);

  const suggestion = await getCardSuggestion({ id: suggestionId });
  if (!suggestion)
    throw new BotError("**uh-oh!**\nthat suggestion doesn't exist anymore.");

  if (suggestion.fulfilledBy)
    throw new BotError(
      "**uh-oh!**\nthat suggestion has been claimed by someone else."
    );

  const _suggestion = await claimCardSuggestion(user.discordId, suggestion.id);

  const privateMessage = await bot.getMessage(
    process.env.PRIVATE_SUGGESTION_CHANNEL!,
    suggestion.privateMessageId
  );

  await privateMessage.edit({
    embeds: [getCardSuggestionEmbed(_suggestion, true)],
    components: [
      row(
        button({
          customId: `fulfill-card-suggestion?${_suggestion.id}&${
            _suggestion.fulfilledBy!.id
          }`,
          style: "blue",
          label: "complete",
        }),
        button({
          customId: `unclaim-card-suggestion?${_suggestion.id}`,
          style: "red",
          label: "unclaim",
        })
      ),
    ],
  });

  const followupEmbed = new Embed().setDescription(
    `${
      emoji.check
    } **suggestion claimed!**\nyou are now responsible for ${emphasis(
      suggestion.groupName
    )} ${emphasis(suggestion.subgroupName, "bi")}!`
  );

  await interaction.createFollowup({ embeds: [followupEmbed], flags: 64 });
  return;
};

export default new Component("claim-card-suggestion").run(run).autoack();
