import { gql } from "@apollo/client/core";
import { Account } from "petal";
import { graphql, GraphQLResponse, Maybe } from "..";

const GET_USER = gql`
  query GetUser($id: Int, $username: String, $discordId: String) {
    user(id: $id, username: $username, discordId: $discordId) {
      id
      discordId
      username
      createdAt
      bio
      currency
      stats {
        cardCount
        gtsTotalGames
        gtsGuessCount
        gtsTotalTime
        gtsTotalRewards
        rollCount
      }
      title {
        title {
          title
        }
      }
      groups {
        group {
          name
        }
      }
    }
  }
`;

export async function getUser({
  id,
  discordId,
  username,
}: {
  id?: number;
  discordId?: string;
  username?: string;
}) {
  const query = (await graphql.query({
    query: GET_USER,
    variables: { discordId, id, username },
  })) as GraphQLResponse<{
    user: Maybe<Account>;
  }>;

  return query.data.user;
}
