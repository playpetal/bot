import { gql } from "@apollo/client/core";
import { PartialUser } from "petal";
import { graphql, GraphQLResponse } from "../../..";
import { tokenize } from "../../../crypto";

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
      time
    }
  }
`;

export async function getWordsTimeLeaderboard(): Promise<
  { account: PartialUser; time: number }[]
> {
  const { data } = (await graphql.query({
    query,
  })) as GraphQLResponse<{
    getWordsTimeLeaderboard: { account: PartialUser; time: number }[];
  }>;

  return data.getWordsTimeLeaderboard;
}
