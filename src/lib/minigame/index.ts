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
  user: PartialUser,
  data: T extends "GTS" ? GTSData : WordsData
): Promise<Minigame<T>> {
  const minigameObject: UnknownMinigame = {
    type: isGTS(data) ? "GTS" : "WORDS",
    playerId: user.id,
    data,
  };

  await redis.set(`minigame:${user.id}`, JSON.stringify(minigameObject));
  return minigameObject as Minigame<T>;
}

export async function getMinigame<T extends MinigameType>(
  user: PartialUser
): Promise<Minigame<T> | null> {
  const minigame = await redis.get(`minigame:${user.id}`);

  if (!minigame) return null;
  return JSON.parse(minigame) as Minigame<never>;
}

export async function destroyMinigame(user: PartialUser): Promise<void> {
  await redis.del(`minigame:${user.id}`);
  return;
}

export function isGTS(data: any): data is GTSData {
  return data?.song !== undefined;
}

export function isWords(data: any): data is WordsData {
  return data?.answer !== undefined;
}
