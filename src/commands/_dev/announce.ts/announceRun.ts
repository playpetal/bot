import { Run } from "petal";
import { announcer } from "../../../lib/announcer/announcer";
import { hasFlag } from "../../../lib/util/flags";
import { Embed } from "../../../struct/embed";
import { BotError } from "../../../struct/error";

export const announceRun: Run = async ({ user, options, courier }) => {
  const content = options.getOption<string>("content")!;
  const shouldPublish = options.getOption<boolean>("publish") || false;

  if (!hasFlag("DEVELOPER", user.flags))
    throw new BotError(
      "**woah there!**\nyou don't have permission to do that."
    );

  const message = await announcer.announce(content, { publish: shouldPublish });

  let embed: Embed;

  if (!message) {
    embed = new Embed().setDescription(
      "**oops!**\ni wasn't able to announce that. make sure the channel ID is correct, and that i can talk there."
    );
  } else {
    embed = new Embed().setDescription(
      `**success!**\nthat message has been announced [here](https://discord.com/channels/${message.guildID}/${message.channel.id}/${message.id})!`
    );
  }

  await courier.send({ embeds: [embed] });
  return;
};
