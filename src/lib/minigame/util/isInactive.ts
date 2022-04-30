import { Minigame, MinigameType } from "petal";

export function isInactive(minigame: Minigame<MinigameType>): boolean {
  return (
    minigame.state === "CANCELLED" ||
    minigame.state === "COMPLETED" ||
    minigame.state === "FAILED"
  );
}
