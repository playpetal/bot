import { gql } from "@apollo/client/core";
import { Account, AccountInput, Maybe } from "petal";
import { query } from "../request";

const GET_USER = gql`
  query GetUser($account: AccountInput!) {
    user(account: $account) {
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

export async function getUser(account: AccountInput): Promise<Maybe<Account>> {
  const data = await query<{ user: Maybe<Account> }>({
    query: GET_USER,
    variables: { account },
  });

  return data.user;
}
