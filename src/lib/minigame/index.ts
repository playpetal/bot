import {
  GTSData,
  CharacterGuessData,
  Minigame,
  MinigameType,
  PartialUser,
  UnknownMinigame,
  WordsData,
} from "petal";
import { redis } from "../redis";

export async function setMinigame<T extends MinigameType>(
  user: PartialUser | number,
  data: T extends "GTS"
    ? GTSData
    : T extends "WORDS"
    ? WordsData
    : T extends "GUESS_CHARACTER"
    ? CharacterGuessData
    : never,
  {
    message,
    channel,
    guild,
  }: { message: string; channel: string; guild: string }
) {
  const type = data.type;
  const playerId = typeof user === "number" ? user : user.id;

  const minigameObject: UnknownMinigame = {
    type,
    playerId,
    channel,
    message,
    guild,
    data,
  };

  await redis.set(`minigame:${playerId}`, JSON.stringify(minigameObject));

  return minigameObject as Minigame<T>;
}

export async function getMinigame<T extends MinigameType>(
  user: PartialUser | number
): Promise<Minigame<T> | null> {
  const minigame = await redis.get(
    `minigame:${typeof user === "number" ? user : user.id}`
  );

  if (!minigame) return null;
  return JSON.parse(minigame) as Minigame<never>;
}

export async function destroyMinigame(
  user: PartialUser | number
): Promise<void> {
  if (typeof user === "number") {
    await redis.del(`minigame:${user}`);
  } else await redis.del(`minigame:${user.id}`);
  return;
}
