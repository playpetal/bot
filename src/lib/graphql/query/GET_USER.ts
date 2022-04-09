import { gql } from "@apollo/client/core";
import { Account } from "petal";
import { Maybe } from "..";
import { query } from "../request";

const GET_USER = gql`
  query GetUser($id: Int, $username: String, $discordId: String) {
    user(id: $id, username: $username, discordId: $discordId) {
      id
      discordId
      username
      flags
      createdAt
      bio
      currency
      premiumCurrency
      stats {
        cardCount
        rollCount
      }
      title {
        title
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
}): Promise<Maybe<Account>> {
  const data = await query<{ user: Maybe<Account> }>({
    query: GET_USER,
    variables: { discordId, id, username },
  });

  return data.user;
}
