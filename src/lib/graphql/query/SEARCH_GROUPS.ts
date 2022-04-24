import { gql } from "@apollo/client/core";
import { query } from "../request";

const operation = gql`
  query SearchGroups($search: String!) {
    searchGroups(search: $search) {
      id
      name
      creation
      gender
      aliases {
        alias
      }
    }
  }
`;

export async function searchGroups(search: string) {
  const data = await query<{
    searchGroups: {
      id: number;
      name: string;
      creation: Date;
      gender: "MALE" | "FEMALE" | "COED" | null;
      aliases: { alias: string }[];
    }[];
  }>({ query: operation, variables: { search } });

  return data.searchGroups;
}
