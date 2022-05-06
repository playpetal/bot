import { bot } from "../../..";
import { claimCardSuggestion } from "../../../lib/graphql/mutation/meta/card-suggestion/claimCardSuggestion";
import { getCardSuggestion } from "../../../lib/graphql/query/meta/card-suggestion/getCardSuggestion";
import { button, row } from "../../../lib/util/component";
import { displayName } from "../../../lib/util/displayName";
import { emoji } from "../../../lib/util/formatting/emoji";
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

  const embed = new Embed()
    .setDescription(
      `${emoji.user} ${displayName(suggestion.suggestedBy)} suggested **${
        suggestion.groupName
      } *${suggestion.subgroupName}***!`
    )
    .setFooter(`Votes: ${_suggestion.votes.length}`);

  const privateMessage = await bot.getMessage(
    process.env.PRIVATE_SUGGESTION_CHANNEL!,
    suggestion.privateMessageId
  );

  await privateMessage.edit({
    embeds: [embed],
    components: [
      row(
        button({
          customId: `claim-card-suggestion?${_suggestion.id}`,
          style: "green",
          label: "claimed!",
          disabled: true,
        }),
        button({
          customId: `delete-card-suggestion?${_suggestion.id}`,
          style: "red",
          label: "delete",
        }),
        button({
          customId: `fulfill-card-suggestion?${_suggestion.id}&${
            _suggestion.fulfilledBy!.id
          }`,
          style: "blue",
          label: "complete",
        })
      ),
    ],
  });

  const followupEmbed = new Embed().setDescription(
    `${emoji.check} **suggestion claimed!**\nyou are now responsible for **${suggestion.groupName} *${suggestion.subgroupName}***!`
  );

  await interaction.createFollowup({ embeds: [followupEmbed], flags: 64 });
  return;
};

export default new Component("claim-card-suggestion").run(run).autoack();
