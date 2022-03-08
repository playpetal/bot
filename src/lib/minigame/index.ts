import {
  GTSData,
  Minigame,
  MinigameType,
  PartialUser,
  UnknownMinigame,
  WordsData,
} from "petal";
import { redis } from "../redis";

export async function setMinigame<T extends MinigameType>(
  user: PartialUser | number,
  data: T extends "GTS" ? GTSData : WordsData,
  {
    message,
    channel,
    guild,
  }: { message: string; channel: string; guild: string }
): Promise<Minigame<T>> {
  const type = isGTS(data) ? "GTS" : "WORDS";

  const minigameObject: UnknownMinigame = {
    type,
    playerId: typeof user === "number" ? user : user.id,
    channel,
    message,
    guild,
    data,
  };

  await redis.set(
    `minigame:${typeof user === "number" ? user : user.id}`,
    JSON.stringify(minigameObject)
  );
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

export function isGTS(data: any): data is GTSData {
  return data?.song !== undefined;
}

export function isWords(data: any): data is WordsData {
  return data?.answer !== undefined;
}
