import { Song } from "..";

export type GTSGameState = {
  startedAt: number;
  firstGuessReward: number;
  timeLimit: number;
  maxGuesses: number;

  playerId: number;
  gameMessageId: string;
  song: Song;
  guesses: number;
  correct: boolean;
};

class GTSGameStateManager {
  private games: Map<number, GTSGameState> = new Map();

  public setState(playerId: number, state: GTSGameState) {
    return this.games.set(playerId, state);
  }

  public unsetState(playerId: number) {
    return this.games.delete(playerId);
  }

  public getState(playerId: number) {
    return this.games.get(playerId);
  }
}

export const gtsGameStateManager = new GTSGameStateManager();
