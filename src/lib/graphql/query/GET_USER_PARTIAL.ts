import { gql } from "@apollo/client/core";
import { Maybe, PartialUser } from "petal";
import { query } from "../request";

const operation = gql`
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
    query: operation,
    variables: { discordId, id, username },
  });

  return data.user;
}
