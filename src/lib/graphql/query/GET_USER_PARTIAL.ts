import { gql } from "@apollo/client/core";
import { graphql, GraphQLResponse, Maybe } from "..";

const GET_USER_PARTIAL = gql`
  query GetUserPartial($id: Int, $username: String, $discordId: String) {
    user(id: $id, username: $username, discordId: $discordId) {
      id
      username
      title {
        title {
          title
        }
      }
    }
  }
`;

export async function getUserPartial(
  discordId?: string,
  id?: number,
  username?: string
) {
  const query = (await graphql.query({
    query: GET_USER_PARTIAL,
    variables: { discordId, id, username },
  })) as GraphQLResponse<{
    user: Maybe<{
      id: number;
      username: string;
      title: { title: { title: string } };
    }>;
  }>;

  return query.data.user;
}
