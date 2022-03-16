import { gql } from "@apollo/client/core";
import { PartialUser } from "petal";
import { graphql, GraphQLResponse } from "../../..";

const query = gql`
  query GetWordsTimeLeaderboard {
    getWordsTimeLeaderboard {
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

export async function getWordsTimeLeaderboard(): Promise<
  { account: PartialUser; value: number }[]
> {
  const { data } = (await graphql.query({
    query,
  })) as GraphQLResponse<{
    getWordsTimeLeaderboard: { account: PartialUser; value: number }[];
  }>;

  return data.getWordsTimeLeaderboard;
}
