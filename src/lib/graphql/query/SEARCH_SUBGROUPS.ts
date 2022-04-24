import { gql } from "@apollo/client/core";
import { query } from "../request";

const operation = gql`
  query SearchSubgroups($search: String!) {
    searchSubgroups(search: $search) {
      id
      name
      creation
    }
  }
`;

export async function searchSubgroups(search: string) {
  const data = await query<{
    searchSubgroups: {
      id: number;
      name: string;
      creation: Date;
    }[];
  }>({ query: operation, variables: { search } });

  return data.searchSubgroups;
}
