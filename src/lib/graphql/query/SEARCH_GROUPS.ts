import { gql } from "@apollo/client/core";
import { graphql, GraphQLResponse } from "..";

const SEARCH_GROUPS = gql`
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
  const query = (await graphql.query({
    query: SEARCH_GROUPS,
    variables: { search },
  })) as GraphQLResponse<{
    searchGroups: {
      id: number;
      name: string;
      creation: Date;
      gender: "MALE" | "FEMALE" | "COED" | null;
      aliases: { alias: string }[];
    }[];
  }>;

  return query.data.searchGroups;
}
