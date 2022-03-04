import { gql } from "@apollo/client/core";
import { PartialUser } from "petal";
import { graphql, GraphQLResponse } from "../../..";
import { tokenize } from "../../../crypto";

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
      time
    }
  }
`;

export async function getGTSTimeLeaderboard(): Promise<
  { account: PartialUser; time: number }[]
> {
  const { data } = (await graphql.query({
    query,
  })) as GraphQLResponse<{
    getGTSTimeLeaderboard: { account: PartialUser; time: number }[];
  }>;

  return data.getGTSTimeLeaderboard;
}
