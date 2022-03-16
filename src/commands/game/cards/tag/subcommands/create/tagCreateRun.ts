import { Run } from "petal";
import { createTag } from "../../../../../../lib/graphql/mutation/game/card/tag/CREATE_TAG";
import { isEmoji } from "../../../../../../lib/graphql/query/game/card/tag/IS_EMOJI";
import { getUserTags } from "../../../../../../lib/graphql/query/GET_USER_TAGS";
import { Embed } from "../../../../../../struct/embed";
import { BotError } from "../../../../../../struct/error";

const run: Run = async ({ interaction, user, options }) => {
  const name = options.getOption<string>("name")!;
  const emoji = options.getOption<string>("emoji")!;

  if (name.length > 15)
    throw new BotError(
      "**woah there!**\n`name` can't be longer than 15 characters."
    );

  const isValidEmoji = await isEmoji(emoji);
  if (!isValidEmoji)
    throw new BotError(
      "**woah there!**\n`emoji` must be a valid Emoji 13.1 or Discord custom emoji."
    );

  const tags = await getUserTags(user.id);
  if (tags.length > 5)
    throw new BotError(
      "**woah there!**\nyou've reached the maximum number of tags... for now!"
    );

  const tagExists = tags.find(
    (t) => t.tag.toLowerCase() === name.toLowerCase()
  );

  if (tagExists)
    throw new BotError(
      `**woah there!**\nyou already have a tag called ${tagExists.emoji} \`${tagExists.tag}\`!`
    );

  const tag = await createTag(user.discordId, name, emoji);

  const embed = new Embed().setDescription(
    `**success!**\nthe tag ${tag.emoji} \`${tag.tag}\` has been created!`
  );

  return interaction.createFollowup({ embeds: [embed] });
};

export default run;
