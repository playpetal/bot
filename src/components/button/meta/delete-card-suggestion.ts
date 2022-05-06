import { bot } from "../../..";
import { deleteCardSuggestion } from "../../../lib/graphql/mutation/meta/card-suggestion/deleteCardSuggestion";
import { getCardSuggestion } from "../../../lib/graphql/query/meta/card-suggestion/getCardSuggestion";
import { emoji } from "../../../lib/util/formatting/emoji";
import { Component, RunComponent } from "../../../struct/component";
import { Embed } from "../../../struct/embed";
import { BotError } from "../../../struct/error";

const run: RunComponent = async ({ interaction, user }) => {
  const suggestionId = parseInt(interaction.data.custom_id.split("?")[1], 10);

  const suggestion = await getCardSuggestion({ id: suggestionId });
  if (!suggestion)
    throw new BotError("**uh-oh!**\nthat suggestion doesn't exist anymore.");

  await deleteCardSuggestion(user.discordId, suggestion.id);

  const embed = new Embed().setDescription(
    `${emoji.check} the suggestion **${suggestion.groupName} *${
      suggestion.subgroupName
    }*** has been deleted with **${suggestion.votes.length}** vote${
      suggestion.votes.length === 1 ? "" : "s"
    }!`
  );

  await interaction.createMessage({ embeds: [embed] });

  await bot.deleteMessage(
    process.env.PUBLIC_SUGGESTION_CHANNEL!,
    suggestion.publicMessageId
  );

  await bot.deleteMessage(
    process.env.PRIVATE_SUGGESTION_CHANNEL!,
    suggestion.privateMessageId
  );

  return;
};

export default new Component("delete-card-suggestion").run(run).autoack();
