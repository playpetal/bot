import { Run } from "petal";
import { editTag } from "../../../../../../lib/graphql/mutation/game/card/tag/EDIT_TAG";
import { getTag } from "../../../../../../lib/graphql/query/game/card/tag/GET_TAG";
import { isEmoji } from "../../../../../../lib/graphql/query/game/card/tag/IS_EMOJI";
import { Embed } from "../../../../../../struct/embed";
import { BotError } from "../../../../../../struct/error";

export const tagEditRun: Run = async function tagEditRun({
  courier,
  user,
  options,
}) {
  const tag = options.getOption<string>("tag")!;

  const targetTag = await getTag(user.discordId, tag);

  if (!targetTag)
    throw new BotError(`**uh oh!**\nyou don't have a tag called \`${tag}\`.`);

  const name = options.getOption<string>("name")?.toLowerCase();
  const emoji = options.getOption<string>("emoji");

  if (!name && !emoji)
    throw new BotError("**hold up!**\nyou didn't specify anything to change.");

  if (!emoji && name === targetTag.tag)
    throw new BotError(
      `**hold up!**\nthe tag is already named ${targetTag.emoji} \`${targetTag.tag}\`.`
    );

  if (!name && emoji === targetTag.emoji)
    throw new BotError(
      `**hold up!**\nthe tag's emoji is already ${targetTag.emoji} \`${targetTag.tag}\`.`
    );

  if (name && emoji && name === targetTag.tag && emoji === targetTag.emoji)
    throw new BotError(
      `**hold up!**\nthe tag is already ${targetTag.emoji} \`${targetTag.tag}\`.`
    );

  if (name) {
    const nameIsInvalid = name.match(/[^a-z0-9]/gim);

    if (nameIsInvalid)
      throw new BotError(
        "**woah there!**\ntag names may only contain alphanumeric characters."
      );
  }

  if (emoji) {
    const isValidEmoji = await isEmoji(emoji);
    if (!isValidEmoji)
      throw new BotError(
        "**woah there!**\n`emoji` must be a valid Emoji 13.1 or Discord custom emoji."
      );
  }

  const _tag = await editTag(user.discordId, targetTag.tag, { name, emoji });

  const embed = new Embed()
    .setDescription(
      `**tag successfully edited!**\nthe tag ${targetTag.emoji} \`${targetTag.tag}\` has been edited to ${_tag.emoji} \`${_tag.tag}\`.`
    )
    .setColor("#3BA55D");

  await courier.send({ embeds: [embed] });
  return;
};
