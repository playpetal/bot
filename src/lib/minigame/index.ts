import {
  GTSData,
  CharacterGuessData,
  Minigame,
  MinigameType,
  PartialUser,
  UnknownMinigame,
  WordsData,
} from "petal";
import { bot } from "../..";
import { Embed } from "../../struct/embed";
import { redis } from "../redis";
import { GTS_MAX_MS } from "./constants";

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
  const playerId = typeof user === "number" ? user : user.id;

  const minigameObject: UnknownMinigame = {
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
): Promise<Minigame<T> | undefined> {
  const minigame = await redis.get(
    `minigame:${typeof user === "number" ? user : user.id}`
  );

  if (!minigame) return;

  const object = JSON.parse(minigame) as Minigame<T>;

  if (object.data.type === "GTS") {
    const {
      data: { startedAt },
      channel,
      message,
    } = object;

    if (startedAt > Date.now() - GTS_MAX_MS) return object;

    try {
      await destroyMinigame(user);
      const gameMessage = await bot.getMessage(channel, message);
      await gameMessage.edit({
        embeds: [
          new Embed()
            .setColor("#F04747")
            .setDescription("**Better luck next time!**\nYou ran out of time!"),
        ],
        components: [],
      });
    } catch {}

    return undefined;
  }

  return object;
}

export async function destroyMinigame(
  user: PartialUser | number
): Promise<void> {
  if (typeof user === "number") {
    await redis.del(`minigame:${user}`);
  } else await redis.del(`minigame:${user.id}`);
  return;
}
