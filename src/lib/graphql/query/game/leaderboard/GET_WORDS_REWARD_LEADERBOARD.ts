import { gql } from "@apollo/client/core";
import { PartialUser, Reward } from "petal";
import { graphql, GraphQLResponse } from "../../..";

const query = gql`
  query GetWordsRewardLeaderboard($type: Reward!) {
    getWordsRewardLeaderboard(type: $type) {
      account {
        id
        username
        discordId
        title {
          title
        }
      }
      value
    }
  }
`;

export async function getWordsRewardLeaderboard(
  type: Reward
): Promise<{ account: PartialUser; value: number }[]> {
  const { data } = (await graphql.query({
    query,
    variables: { type },
  })) as GraphQLResponse<{
    getWordsRewardLeaderboard: { account: PartialUser; value: number }[];
  }>;

  return data.getWordsRewardLeaderboard;
}
