import { gql } from "@apollo/client/core";
import { AccountInput, Maybe } from "petal";
import { query } from "../request";

const operation = gql`
  query GetUser($account: AccountInput!) {
    user(account: $account) {
      supporterTime
    }
  }
`;

export async function getSupporterTime(
  account: AccountInput
): Promise<Maybe<number>> {
  const data = await query<{ user: Maybe<{ supporterTime: Maybe<number> }> }>({
    query: operation,
    variables: { account },
  });

  return data.user?.supporterTime || null;
}
