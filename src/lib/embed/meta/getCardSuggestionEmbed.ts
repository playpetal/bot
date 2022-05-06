import { CardSuggestion } from "petal";
import { Embed } from "../../../struct/embed";
import { displayName } from "../../util/displayName";
import { emoji } from "../../util/formatting/emoji";

export function getCardSuggestionEmbed(
  suggestion: CardSuggestion,
  isPrivate: boolean = false
): Embed {
  const embed = new Embed();

  embed.setDescription(
    `${emoji.user} ${displayName(suggestion.suggestedBy)} suggested **${
      suggestion.groupName
    } *${suggestion.subgroupName}***!` +
      (isPrivate && suggestion.fulfilledBy !== null
        ? `\n\n**claimed by <@${suggestion.fulfilledBy.discordId}>**`
        : ``)
  );

  let footer = `votes: ${suggestion.votes.length}`;

  if (!isPrivate) {
    embed.setColor("#0099FF");
    if (suggestion.fulfilled)
      footer += ` • this suggestion has been fulfilled!`;
  } else {
    if (suggestion.fulfilled) {
      embed.setColor("#2D7D46");
      footer += ` • completed`;
    } else if (suggestion.fulfilledBy) {
      embed.setColor("#0099FF");
      footer += ` • claimed`;
    } else {
      embed.setColor("#2F3136");
      footer += ` • unclaimed`;
    }
  }

  embed.setFooter(footer);

  return embed;
}
