import { UnknownMinigame } from "petal";
import { logger } from "..";

export function logMinigame(minigame: UnknownMinigame): void {
  logger.info({
    message: {
      ...minigame,
      guild: undefined,
      channel: undefined,
      message: undefined,
      guildId: minigame.guild,
      channelId: minigame.channel,
      messageId: minigame.message,
    },
  });
}

export function logMissingWord(word: string): void {
  logger.info({
    word,
  });
}
