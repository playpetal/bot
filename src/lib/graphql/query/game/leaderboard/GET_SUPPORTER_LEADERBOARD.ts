import { gql } from "@apollo/client/core";
import { PartialUser } from "petal";
import { graphql, GraphQLResponse } from "../../..";
import { tokenize } from "../../../crypto";

const query = gql`
  query GetSupporterLeaderboard {
    getSupporterLeaderboard {
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

export async function getSupporterLeaderboard(): Promise<
  { account: PartialUser; value: number }[]
> {
  const { data } = (await graphql.query({
    query,
  })) as GraphQLResponse<{
    getSupporterLeaderboard: { account: PartialUser; value: number }[];
  }>;

  return data.getSupporterLeaderboard;
}
