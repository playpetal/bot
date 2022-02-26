import { gql } from "@apollo/client/core";
import { graphql, GraphQLResponse, Maybe } from "../../../..";

const query = gql`
  query GetWordsStats($id: Int) {
    user(id: $id) {
      words {
        totalWords
        totalTime
        totalGames
        totalCards
        totalCurrency
        totalPremiumCurrency
      }
    }
  }
`;

export async function getWordsStats(id: number): Promise<
  Maybe<{
    totalWords: number;
    totalTime: number;
    totalGames: number;
    totalCards: number;
    totalCurrency: number;
    totalPremiumCurrency: number;
  }>
> {
  const { data } = (await graphql.query({
    query,
    variables: { id },
  })) as GraphQLResponse<{
    user: Maybe<{
      words: Maybe<{
        totalWords: number;
        totalTime: number;
        totalGames: number;
        totalCards: number;
        totalCurrency: number;
        totalPremiumCurrency: number;
      }>;
    }>;
  }>;

  return data.user?.words || null;
}
