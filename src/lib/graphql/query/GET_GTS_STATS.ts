import { gql } from "@apollo/client/core";
import { graphql, GraphQLResponse, Maybe } from "..";

const query = gql`
  query GetGTSStats($id: Int) {
    user(id: $id) {
      gts {
        totalGuesses
        totalTime
        totalGames
        totalCards
        totalCurrency
      }
    }
  }
`;

export async function getGTSStats(id: number): Promise<
  Maybe<{
    totalGuesses: number;
    totalTime: number;
    totalGames: number;
    totalCards: number;
    totalCurrency: number;
  }>
> {
  const { data } = (await graphql.query({
    query,
    variables: { id },
  })) as GraphQLResponse<{
    user: Maybe<{
      gts: Maybe<{
        totalGuesses: number;
        totalTime: number;
        totalGames: number;
        totalCards: number;
        totalCurrency: number;
      }>;
    }>;
  }>;

  return data.user?.gts || null;
}
