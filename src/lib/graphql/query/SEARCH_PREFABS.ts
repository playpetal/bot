import { gql } from "@apollo/client/core";
import { graphql, GraphQLResponse } from "..";

const SEARCH_PREFABS = gql`
  query SearchPrefabs($search: String!) {
    searchPrefabs(search: $search) {
      id
      character {
        name
      }
      subgroup {
        name
      }
      group {
        name
      }
      maxCards
      rarity
    }
  }
`;

export async function searchPrefabs(search: string) {
  const query = (await graphql.query({
    query: SEARCH_PREFABS,
    variables: { search },
  })) as GraphQLResponse<{
    searchPrefabs: {
      id: number;
      character: { name: string };
      subgroup: { name: string } | null;
      group: { name: string } | null;
      maxCards: number;
      rarity: number;
    }[];
  }>;

  return query.data.searchPrefabs;
}
