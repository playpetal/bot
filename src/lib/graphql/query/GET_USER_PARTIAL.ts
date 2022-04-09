import { gql } from "@apollo/client/core";
import { PartialUser } from "petal";
import { Maybe } from "..";
import { query } from "../request";

const GET_USER_PARTIAL = gql`
  query GetUserPartial($id: Int, $username: String, $discordId: String) {
    user(id: $id, username: $username, discordId: $discordId) {
      id
      discordId
      username
      title {
        title
      }
      flags
    }
  }
`;

export async function getUserPartial({
  discordId,
  id,
  username,
}: {
  discordId?: string;
  id?: number;
  username?: string;
}) {
  const data = await query<{ user: Maybe<PartialUser> }>({
    query: GET_USER_PARTIAL,
    variables: { discordId, id, username },
  });

  return data.user;
}
