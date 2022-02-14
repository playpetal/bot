import axios from "axios";
import { Card } from "petal";
import { logger } from "../logger";

export async function getCardImage(card: Card): Promise<Buffer> {
  const {
    data: { hash },
  } = (await axios.get(`${process.env.ONI_URL!}/hash`, {
    headers: { Authorization: process.env.ONI_SHARED_SECRET! },
    data: { id: card.prefab.id },
  })) as { data: { hash: string } };

  try {
    const { data } = (await axios.post(`${process.env.ONI_URL!}/card`, [
      {
        frame: card.hasFrame
          ? `https://cdn.playpetal.com/f/${hash}.png`
          : `#${card.tint.toString(16)}`,
        name: card.prefab.character.name,
        id: card.id,
        character: `https://cdn.playpetal.com/p/${hash}.png`,
      },
    ])) as {
      data: { card: string };
    };

    return Buffer.from(data.card, "base64");
  } catch (e) {
    logger.error(e);
    return Buffer.alloc(0);
  }
}
