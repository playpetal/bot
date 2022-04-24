import { gql } from "@apollo/client/core";
import { query } from "../request";

const operation = gql`
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
  const data = await query<{
    searchPrefabs: {
      id: number;
      character: { name: string };
      subgroup: { name: string } | null;
      group: { name: string } | null;
      maxCards: number;
      rarity: number;
    }[];
  }>({ query: operation, variables: { search } });

  return data.searchPrefabs;
}
