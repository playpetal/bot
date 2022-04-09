import { gql } from "@apollo/client/core";
import { Maybe, MinigameStats, MinigameType } from "petal";
import { query } from "../../request";

const operation = gql`
  query GetMinigameStats($id: Int!, $type: MinigameType!) {
    user(id: $id) {
      minigameStats(type: $type) {
        type
        totalAttempts
        totalCards
        totalCurrency
        totalGames
        totalPremiumCurrency
        totalTime
      }
    }
  }
`;

export async function getMinigameStats<T extends MinigameType>(
  id: number,
  type: T
): Promise<Maybe<MinigameStats<T>>> {
  const data = await query<{
    user: { minigameStats: Maybe<MinigameStats<T>> };
  }>({
    query: operation,
    variables: { id, type },
  });

  return data.user.minigameStats;
}
