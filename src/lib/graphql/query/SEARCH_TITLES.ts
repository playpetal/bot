import { gql } from "@apollo/client/core";
import { query } from "../request";

const operation = gql`
  query SearchTitles($search: String!) {
    searchTitles(search: $search) {
      id
      title
      description
      ownedCount
    }
  }
`;

export async function searchTitles(search: string) {
  const data = await query<{
    searchTitles: {
      id: number;
      title: string;
      description: string;
      ownedCount: number;
    }[];
  }>({ query: operation, variables: { search } });

  return data.searchTitles;
}
