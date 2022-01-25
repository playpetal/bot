import { gql } from "@apollo/client/core";
import { graphql, GraphQLResponse } from "..";

const GET_USER_GROUPS = gql`
  query GetUserGroups($search: String, $exact: String) {
    userGroups(search: $search, exact: $exact) {
      id
      name
    }
  }
`;

export async function getUserGroups(exact?: string, search?: string) {
  const query = (await graphql.query({
    query: GET_USER_GROUPS,
    variables: { exact, search },
  })) as GraphQLResponse<{
    userGroups: {
      id: number;
      name: string;
    }[];
  }>;

  return query.data.userGroups;
}
