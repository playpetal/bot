import { deleteTag } from "../../../../lib/graphql/mutation/game/card/tag/DELETE_TAG";
import { Component, RunComponent } from "../../../../struct/component";
import { Embed } from "../../../../struct/embed";
import { BotError } from "../../../../struct/error";

const run: RunComponent = async function ({ interaction, user }) {
  const [_customId, accountIdStr, tag] = interaction.data.custom_id.split("?");
  if (!accountIdStr || !tag) return;

  const accountId = parseInt(accountIdStr);

  if (user.id !== accountId)
    throw new BotError("**woah there!**\nthose buttons aren't for you.");

  const _tag = await deleteTag(user.discordId, tag);

  const embed = new Embed()
    .setColor("#3BA55D")
    .setDescription(
      `**tag sucessfully deleted!**\nthe tag ${_tag.emoji} \`${_tag.tag}\` has been deleted.`
    )
    .setFooter(
      `${_tag.cardCount} card${
        _tag.cardCount === 1 ? "" : "s"
      } have been untagged.`
    );

  await interaction.editOriginalMessage({ embeds: [embed], components: [] });
  return;
};

const command = new Component("delete-tag").run(run).autoack();

export default command;
