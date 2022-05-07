import { Run } from "petal";
import { getHelpNotFoundEmbed } from "../../../lib/embed/help/empty";
import { getHelpMainEmbed } from "../../../lib/embed/help/main";
import { help, helpTopics } from "../../../lib/help/topics";
import { row } from "../../../lib/util/component";
import { getHelpSelectMenu } from "../../../lib/util/component/help/getHelpSelectMenu";
import { Embed } from "../../../struct/embed";

export const helpRun: Run = async function ({ courier, user, options }) {
  const topic = options.getOption<string>("topic") as
    | typeof helpTopics[number]
    | undefined;
  let embed: Embed;

  if (!topic) {
    embed = getHelpMainEmbed();
  } else {
    const entry = help[topic];
    if (!entry) {
      embed = getHelpNotFoundEmbed();
    } else embed = entry.getEmbed();
  }

  await courier.send({
    embeds: [embed],
    components: [row(getHelpSelectMenu(user, topic))],
  });
  return;
};
