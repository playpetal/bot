import { gql } from "@apollo/client/core";
import { Leaderboard, LeaderboardType } from "petal";
import { query } from "../../../request";

const operation = gql`
  query GetLeaderboard($type: LeaderboardType!) {
    getLeaderboard(type: $type) {
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

export async function getLeaderboard(
  type: LeaderboardType
): Promise<Leaderboard[]> {
  const data = await query<{
    getLeaderboard: Leaderboard[];
  }>({
    query: operation,
    variables: { type },
  });

  return data.getLeaderboard;
}
