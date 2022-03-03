import { UnknownMinigame } from "petal";
import { logger } from "..";

export function logMinigame(minigame: UnknownMinigame): void {
  logger.info(minigame);
}
