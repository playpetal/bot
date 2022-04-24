import { gql } from "@apollo/client/core";
import { Tag } from "petal";
import { tokenize } from "../crypto";
import { query } from "../request";

const operation = gql`
  query SearchTags($search: String!) {
    searchTags(search: $search) {
      id
      emoji
      tag
    }
  }
`;

export async function searchTags(discordId: string, search: string) {
  const data = await query<{
    searchTags: Tag[];
  }>({
    query: operation,
    variables: { search },
    authorization: tokenize(discordId),
  });

  return data.searchTags;
}
