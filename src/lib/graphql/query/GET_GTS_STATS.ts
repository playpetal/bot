import { gql } from "@apollo/client/core";
import { graphql, GraphQLResponse, Maybe } from "..";

const query = gql`
  query GetGTSStats($id: Int) {
    user(id: $id) {
      stats {
        gtsTotalGames
        gtsGuessCount
        gtsTotalTime
        gtsTotalRewards
        gtsCurrentGames
        gtsLastGame
      }
    }
  }
`;

export async function getGTSStats(id: number) {
  const { data } = (await graphql.query({
    query,
    variables: { id },
  })) as GraphQLResponse<{
    user: Maybe<{
      stats: {
        gtsTotalGames: number;
        gtsGuessCount: number;
        gtsTotalTime: number;
        gtsTotalRewards: number;
        gtsCurrentGames: number;
        gtsLastGame: Maybe<number>;
      };
    }>;
  }>;

  return data.user;
}
