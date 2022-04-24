import { gql } from "@apollo/client/core";
import { Maybe } from "petal";
import { query } from "../request";

const operation = gql`
  query GetUserTitles($id: Int!) {
    getUserTitle(id: $id) {
      id
      account {
        id
      }
      title {
        title
        description
      }
    }
  }
`;

export async function getUserTitle(id: number) {
  const data = await query<{
    getUserTitle: Maybe<{
      id: number;
      account: { id: number };
      title: { title: string; description: Maybe<string> };
    }>;
  }>({ query: operation, variables: { id } });

  return data.getUserTitle;
}
