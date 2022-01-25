import { gql } from "@apollo/client/core";
import { graphql, GraphQLResponse } from "..";

const GET_TITLE = gql`
  query GetTitle($id: Int, $name: String) {
    titles(id: $id, name: $name) {
      id
      title
      description
      ownedCount
    }
  }
`;

export async function getTitle(id?: number, name?: string) {
  const query = (await graphql.query({
    query: GET_TITLE,
    variables: { id, name },
  })) as GraphQLResponse<{
    titles: {
      id: number;
      title: string;
      description: string | null;
      ownedCount: number;
    }[];
  }>;

  return query.data.titles;
}
