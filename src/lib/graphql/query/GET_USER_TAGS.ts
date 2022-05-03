import { gql } from "@apollo/client/core";
import { AccountInput, Tag } from "petal";
import { query } from "../request";

const operation = gql`
  query GetUserTags($account: AccountInput!) {
    user(account: $account) {
      id
      tags {
        id
        emoji
        tag
      }
    }
  }
`;

export async function getUserTags(account: AccountInput) {
  const data = await query<{ user: { tags: Tag[] } }>({
    query: operation,
    variables: { account },
  });

  return data.user.tags;
}
