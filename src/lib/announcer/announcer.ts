import {
  FileContent,
  Message,
  MessageContent,
  NewsChannel,
  TextChannel,
} from "eris";
import { bot } from "../..";
import { getAnnouncements } from "../graphql/query/getAnnouncements";
import { logger } from "../logger";

class Announcer {
  private channel: TextChannel | NewsChannel | undefined;
  private pollInterval: NodeJS.Timer | undefined;

  public async fetchChannel(): Promise<TextChannel | undefined> {
    if (this.channel) return this.channel;

    const channelId = process.env.ANNOUNCE_CHANNEL_ID;
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

  public async beginPolling() {
    if (this.pollInterval) return;

    this.pollInterval = setInterval(async () => {
      try {
        const announcements = await getAnnouncements();

        for (let announcement of announcements) {
          const ms = Math.min(Date.now() - announcement.createdAt, 0);

          setTimeout(
            async () =>
              await this.announce(announcement.announcement, { publish: true }),
            ms
          );
        }
      } catch {
        // fail silently if we can't connect to the api
      }
    }, 2500);
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
