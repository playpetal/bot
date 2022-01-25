import { gql } from "@apollo/client/core";
import { graphql, GraphQLResponse } from "..";

const SEARCH_SUBGROUPS = gql`
  query SearchSubgroups($search: String!) {
    searchSubgroups(search: $search) {
      id
      name
      creation
    }
  }
`;

export async function searchSubgroups(search: string) {
  const query = (await graphql.query({
    query: SEARCH_SUBGROUPS,
    variables: { search },
  })) as GraphQLResponse<{
    searchSubgroups: {
      id: number;
      name: string;
      creation: Date;
    }[];
  }>;

  return query.data.searchSubgroups;
}
