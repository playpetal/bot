import { Run } from "petal";
import { deleteTag } from "../../../../../../lib/graphql/mutation/game/card/tag/DELETE_TAG";
import { getTag } from "../../../../../../lib/graphql/query/game/card/tag/GET_TAG";
import { button, row } from "../../../../../../lib/util/component";
import { strong } from "../../../../../../lib/util/formatting/strong";
import { Embed } from "../../../../../../struct/embed";
import { BotError } from "../../../../../../struct/error";

const run: Run = async function tagDeleteRun({ courier, user, options }) {
  const tag = options.getOption<string>("tag")!;

  const targetTag = await getTag(user.discordId, tag);

  if (!targetTag)
    throw new BotError(`**uh oh!**\nyou don't have a tag called \`${tag}\`.`);

  if (targetTag.cardCount === 0) {
    await deleteTag(user.discordId, targetTag.tag);

    const embed = new Embed()
      .setDescription(
        `**tag successfully deleted!**\nthe tag ${targetTag.emoji} \`${targetTag.tag}\` has been deleted.`
      )
      .setFooter(`no cards had this tag, so you didn't need to confirm.`)
      .setColor("#3BA55D");

    await courier.send({ embeds: [embed] });
    return;
  }

  const embed = new Embed().setDescription(
    `**wait a sec!**\nare you sure you want to delete ${targetTag.emoji} \`${
      targetTag.tag
    }\`?\n${strong(targetTag.cardCount)} card${
      targetTag.cardCount === 1 ? "" : "s"
    } have this tag, and this can't be reversed!`
  );

  return courier.send({
    embeds: [embed],
    components: [
      row(
        button({
          customId: `delete-tag?${user.id}?${targetTag.tag}`,
          label: "confirm deletion",
          style: "green",
        }),
        button({
          customId: `self-destruct?${user.id}`,
          label: "cancel",
          style: "red",
        })
      ),
    ],
  });
};

export default run;
