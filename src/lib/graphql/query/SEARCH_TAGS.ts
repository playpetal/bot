import { gql } from "@apollo/client/core";
import { Tag } from "petal";
import { graphql, GraphQLResponse } from "..";
import { tokenize } from "../crypto";

const query = gql`
  query SearchTags($search: String!) {
    searchTags(search: $search) {
      id
      emoji
      tag
    }
  }
`;

export async function searchTags(discordId: string, search: string) {
  const { data } = (await graphql.query({
    query,
    variables: { search },
    context: { headers: { Authorization: tokenize(discordId) } },
  })) as GraphQLResponse<{
    searchTags: Tag[];
  }>;

  return data.searchTags;
}
