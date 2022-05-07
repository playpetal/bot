import { ComponentInteractionSelectMenuData } from "eris";
import { help, Topic } from "../../lib/help/topics";
import { row } from "../../lib/util/component";
import { getHelpSelectMenu } from "../../lib/util/component/help/getHelpSelectMenu";
import { Component, RunComponent } from "../../struct/component";

const run: RunComponent = async function ({ interaction, user }) {
  const [_customId, accountIdStr] = interaction.data.custom_id.split("?");
  if (!accountIdStr) return;

  const accountId = parseInt(accountIdStr);
  if (user.id !== accountId) return;

  const topic = (interaction.data as ComponentInteractionSelectMenuData)
    .values[0] as Topic;

  const helpTopic = help[topic];
  if (!helpTopic) return;

  await interaction.editOriginalMessage({
    embeds: [helpTopic.getEmbed()],
    components: [row(getHelpSelectMenu(user, topic))],
  });

  return;
};

const command = new Component("select-help").run(run).autoack();

export default command;
