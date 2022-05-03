import { gql } from "@apollo/client/core";
import { AccountInput, Maybe, MinigameStats, MinigameType } from "petal";
import { query } from "../../request";

const operation = gql`
  query GetMinigameStats($account: AccountInput!, $type: MinigameType!) {
    user(account: $account) {
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
  account: AccountInput,
  type: T
): Promise<Maybe<MinigameStats<T>>> {
  const data = await query<{
    user: { minigameStats: Maybe<MinigameStats<T>> };
  }>({
    query: operation,
    variables: { account, type },
  });

  return data.user.minigameStats;
}
