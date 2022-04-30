import { gql } from "@apollo/client/core";
import { Tag } from "petal";
import { query } from "../request";

const operation = gql`
  query GetUserTags($id: Int) {
    user(id: $id) {
      id
      tags {
        id
        emoji
        tag
      }
    }
  }
`;

export async function getUserTags(id: number) {
  const data = await query<{ user: { tags: Tag[] } }>({
    query: operation,
    variables: { id },
  });

  return data.user.tags;
}
