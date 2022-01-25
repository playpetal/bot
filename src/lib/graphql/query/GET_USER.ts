import { gql } from "@apollo/client/core";
import { graphql, GraphQLResponse, Maybe } from "..";

const GET_USER = gql`
  query GetUser($id: Int, $username: String, $discordId: String) {
    user(id: $id, username: $username, discordId: $discordId) {
      id
      username
      createdAt
      bio
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

export async function getUser(
  discordId?: string,
  id?: number,
  username?: string
) {
  const query = (await graphql.query({
    query: GET_USER,
    variables: { discordId, id, username },
  })) as GraphQLResponse<{
    user: Maybe<{
      id: number;
      username: string;
      title: { title: { title: string } } | null;
      createdAt: string;
      bio: string;
      groups: { group: { name: string } }[];
    }>;
  }>;

  return query.data.user;
}
