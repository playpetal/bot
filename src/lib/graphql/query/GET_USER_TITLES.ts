import { gql } from "@apollo/client/core";
import { graphql, GraphQLResponse } from "..";

const GET_USER_TITLES = gql`
  query GetUserTitles($id: Int!) {
    userTitles(id: $id) {
      title {
        title
        description
      }
    }
  }
`;

export async function getUserTitles(id: number) {
  const query = (await graphql.query({
    query: GET_USER_TITLES,
    variables: { id },
  })) as GraphQLResponse<{
    userTitles: {
      id: number;
      title: {
        title: string;
        description: string | null;
      };
    }[];
  }>;

  return query.data.userTitles;
}
