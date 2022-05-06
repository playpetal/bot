import { bot } from "../../..";
import { voteCardSuggestion } from "../../../lib/graphql/mutation/meta/card-suggestion/voteCardSuggestion";
import { getCardSuggestion } from "../../../lib/graphql/query/meta/card-suggestion/getCardSuggestion";
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

  const { votes } = await voteCardSuggestion(user.discordId, suggestion.id);

  const embed = new Embed()
    .setDescription(
      `${emoji.user} ${displayName(suggestion.suggestedBy)} suggested **${
        suggestion.groupName
      } *${suggestion.subgroupName}***!`
    )
    .setFooter(`Votes: ${votes.length}`);

  const publicMessage = await bot.getMessage(
    process.env.PUBLIC_SUGGESTION_CHANNEL!,
    suggestion.publicMessageId
  );

  await publicMessage.edit({
    embeds: [embed],
    components: publicMessage.components,
  });

  const privateMessage = await bot.getMessage(
    process.env.PRIVATE_SUGGESTION_CHANNEL!,
    suggestion.privateMessageId
  );

  await privateMessage.edit({
    embeds: [embed],
    components: privateMessage.components,
  });

  const followupEmbed = new Embed().setDescription(
    `${emoji.check} **vote added!**\nyou gave one vote to **${suggestion.groupName} *${suggestion.subgroupName}***!`
  );

  await interaction.createFollowup({ embeds: [followupEmbed], flags: 64 });
  return;
};

export default new Component("vote-card-suggestion").run(run).autoack();
