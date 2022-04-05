import {
  FileContent,
  Message,
  MessageContent,
  NewsChannel,
  TextChannel,
} from "eris";
import { bot } from "../..";
import { logger } from "../logger";

class Announcer {
  private channel: TextChannel | NewsChannel | undefined;

  public async fetchChannel(): Promise<TextChannel | undefined> {
    if (this.channel) return this.channel;

    // TODO: remove hardcode once i get my laptop back
    const channelId = "960911514632605786";
    if (!channelId) return;

    try {
      const channel = await bot.getRESTChannel(channelId);

      const isTextChannel = channel instanceof TextChannel;
      const isNewsChannel = channel instanceof NewsChannel;

      if (!isTextChannel && !isNewsChannel) {
        logger.warn(
          `Announcements channel ${channelId} is not of type TextChannel | NewsChannel.`
        );

        return;
      }

      this.channel = channel;
      return this.channel;
    } catch (e) {
      logger.warn(`Failed to load announcements channel: ${e}`);
    }
  }

  public async announce(
    content: MessageContent,
    options?: { files?: FileContent[]; publish?: boolean }
  ): Promise<Message<TextChannel | NewsChannel> | undefined> {
    const channel = await this.fetchChannel();
    if (!channel) return undefined;

    const message = await channel.createMessage(content, options?.files);

    if (channel instanceof NewsChannel && options?.publish)
      await channel.crosspostMessage(message.id);

    return message;
  }
}

export const announcer = new Announcer();
