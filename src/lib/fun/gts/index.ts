import axios from "axios";
import { bot } from "../../..";
import { getRandomSong } from "../../graphql/query/GET_RANDOM_SONG";
import { redis } from "../../redis";

export type Song = { id: number; title: string; group: { name: string } };

type GTSSong = {
  song: Song;
  buffer: Buffer;
};

type RedisSong = {
  song: Song;
  encodedBuffer: string;
};

class GTSManager {
  public async getStackLength() {
    return await redis.llen("songs");
  }

  public async getSong(): Promise<GTSSong> {
    const song = await redis.rpop("songs");

    if (song) {
      const jsonSong = JSON.parse(song) as RedisSong;

      return {
        song: jsonSong.song,
        buffer: Buffer.from(jsonSong.encodedBuffer, "base64"),
      };
    }

    return await this.requestSong(false);
  }

  public async requestSong(addToStack: boolean = true): Promise<GTSSong> {
    const song = await getRandomSong();

    if (!song) throw Error("No songs");

    try {
      const {
        data: { url },
      } = (await axios.get(`${process.env.YURE_URL}/song?id=${song.id}`)) as {
        data: { url: string };
      };

      const { data } = (await axios.get(url, {
        responseType: "arraybuffer",
      })) as { data: Buffer };

      const instance = { song, buffer: data };

      if (addToStack) {
        const encoded: RedisSong = {
          song: instance.song,
          encodedBuffer: data.toString("base64"),
        };

        await redis.rpush("songs", JSON.stringify(encoded));
      }
      return instance;
    } catch (e) {
      if ((e as Error).stack?.includes("ECONNREFUSED")) {
        // TODO: don't hardcode this you fucking moron
        const user = await bot.getRESTUser("915329934019407872");
        (await user.getDMChannel()).createMessage(
          "Hey dipshit, GTS service is offline!"
        );
      }

      throw new Error("Failed to connect to Angreifer!");
    }
  }

  public async clearSongQueue(): Promise<number> {
    return await redis.del("songs");
  }

  public async setFirstGuessReward(reward: number): Promise<void> {
    await redis.set("gtsFirstGuessReward", reward);
    return;
  }

  public async getFirstGuessReward(): Promise<number> {
    const reward = await redis.get("gtsFirstGuessReward");

    if (!reward) {
      console.warn("gtsFirstGuessReward is unconfigured, using fallback");
      return 0;
    } else return parseInt(reward, 10);
  }

  public async setTimeLimit(seconds: number): Promise<void> {
    await redis.set("gtsTimeLimit", seconds);
    return;
  }

  public async getTimeLimit(): Promise<number> {
    const time = await redis.get("gtsTimeLimit");

    if (!time) {
      console.warn("gtsTimeLimit is unconfigured, using fallback");
      return 15;
    } else return parseInt(time, 10);
  }

  public async setMaxGuesses(maxGuesses: number): Promise<void> {
    await redis.set("gtsMaxGuesses", maxGuesses);
    return;
  }

  public async getMaxGuesses(): Promise<number> {
    const guesses = await redis.get("gtsMaxGuesses");

    if (!guesses) {
      console.warn("gtsMaxGuesses is unconfigured, using fallback");
      return 3;
    } else return parseInt(guesses, 10);
  }
}

export const gts = new GTSManager();
