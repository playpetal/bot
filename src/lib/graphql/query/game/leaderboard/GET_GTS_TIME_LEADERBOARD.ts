import { gql } from "@apollo/client/core";
import { PartialUser } from "petal";
import { graphql, GraphQLResponse } from "../../..";

const query = gql`
  query GetGTSTimeLeaderboard {
    getGTSTimeLeaderboard {
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

export async function getGTSTimeLeaderboard(): Promise<
  { account: PartialUser; value: number }[]
> {
  const { data } = (await graphql.query({
    query,
  })) as GraphQLResponse<{
    getGTSTimeLeaderboard: { account: PartialUser; value: number }[];
  }>;

  return data.getGTSTimeLeaderboard;
}
