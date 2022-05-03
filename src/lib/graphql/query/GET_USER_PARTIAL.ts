import { gql } from "@apollo/client/core";
import { AccountInput, Maybe, PartialUser } from "petal";
import { query } from "../request";

const operation = gql`
  query GetUserPartial($account: AccountInput!) {
    user(account: $account) {
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

export async function getUserPartial(account: AccountInput) {
  const data = await query<{ user: Maybe<PartialUser> }>({
    query: operation,
    variables: { account },
  });

  return data.user;
}
