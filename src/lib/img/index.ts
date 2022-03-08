import axios from "axios";
import { Card } from "petal";
import { logger } from "../logger";
import { dd } from "../statsd";

export async function getCardImage(card: Card): Promise<Buffer> {
  const hash = await getHash(card.prefab.id);

  try {
    const start = Date.now();
    const { data } = (await axios.post(`${process.env.ONI_URL!}/card`, [
      {
        frame: card.hasFrame
          ? `https://cdn.playpetal.com/f/${await getHash(card.id)}.png`
          : `#${card.tint.toString(16).padStart(6, "0")}`,
        name: card.prefab.character.name,
        id: card.id,
        character: `https://cdn.playpetal.com/p/${hash}.png`,
      },
    ])) as {
      data: { card: string };
    };

    dd.timing("oni.image.response", Date.now() - start);
    return Buffer.from(data.card, "base64");
  } catch (e) {
    logger.error(e);
    return Buffer.alloc(0);
  }
}

export async function getHash(number: number): Promise<string> {
  const start = Date.now();
  const {
    data: { hash },
  } = (await axios.get(`${process.env.ONI_URL!}/hash`, {
    headers: { Authorization: process.env.ONI_SHARED_SECRET! },
    data: { id: number },
  })) as { data: { hash: string } };
  dd.timing("oni.hash.response", Date.now() - start);

  return hash;
}

export async function uploadImage(
  imageUrl: string,
  id: number,
  type: "prefab" | "frame"
): Promise<string> {
  const {
    data: { url },
  } = (await axios.post(`${process.env.ONI_URL!}/upload`, {
    id,
    url: imageUrl,
    type,
  })) as { data: { url: string } };

  return url;
}
