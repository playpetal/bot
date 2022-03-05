import { gql } from "@apollo/client/core";
import { PartialUser, Reward } from "petal";
import { graphql, GraphQLResponse } from "../../..";

const query = gql`
  query GetGTSRewardLeaderboard($type: Reward!) {
    getGTSRewardLeaderboard(type: $type) {
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

export async function getGTSRewardLeaderboard(
  type: Reward
): Promise<{ account: PartialUser; value: number }[]> {
  const { data } = (await graphql.query({
    query,
    variables: { type },
  })) as GraphQLResponse<{
    getGTSRewardLeaderboard: { account: PartialUser; value: number }[];
  }>;

  return data.getGTSRewardLeaderboard;
}
