import { gql } from "@apollo/client/core";
import { graphql, GraphQLResponse } from "..";

const SEARCH_TITLES = gql`
  query SearchTitles($search: String!) {
    searchTitles(search: $search) {
      id
      title
      description
    }
  }
`;

export async function searchTitles(search: string) {
  const query = (await graphql.query({
    query: SEARCH_TITLES,
    variables: { search },
  })) as GraphQLResponse<{
    searchTitles: {
      id: number;
      title: string;
      description: string;
    }[];
  }>;

  return query.data.searchTitles;
}
