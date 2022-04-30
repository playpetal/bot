import { gql } from "@apollo/client/core";
import { query } from "../request";

const operation = gql`
  query GetUserTitles($accountId: Int!, $search: String) {
    userTitles(accountId: $accountId, search: $search) {
      id
      title {
        title
        description
      }
      accountId
    }
  }
`;

export async function getUserTitles(accountId: number, search?: string) {
  const data = await query<{
    userTitles: {
      id: number;
      title: { title: string; description: string | null };
      accountId: number;
    }[];
  }>({ query: operation, variables: { accountId, search } });

  return data.userTitles;
}
