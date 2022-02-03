import { gql } from "@apollo/client/core";
import { graphql, GraphQLResponse } from "..";

const query = gql`
  query GetUserTitles($accountId: Int!, $search: String) {
    userTitles(accountId: $accountId, search: $search) {
      id
      title {
        title
        description
      }
    }
  }
`;

export async function getUserTitles(accountId: number, search?: string) {
  const { data } = (await graphql.query({
    query,
    variables: { accountId, search },
  })) as GraphQLResponse<{
    userTitles: {
      id: number;
      title: {
        title: string;
        description: string | null;
      };
    }[];
  }>;

  return data.userTitles;
}
