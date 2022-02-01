import { gql } from "@apollo/client/core";
import { graphql, GraphQLResponse, Maybe } from "..";

const GET_USER = gql`
  query GetUser($id: Int, $username: String, $discordId: String) {
    user(id: $id, username: $username, discordId: $discordId) {
      id
      username
      createdAt
      bio
      currency
      cardCount
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
    user: Maybe<{
      id: number;
      username: string;
      currency: number;
      cardCount: number;
      title: { title: { title: string } } | null;
      createdAt: number;
      bio: string;
      groups: { group: { name: string } }[];
    }>;
  }>;

  return query.data.user;
}
