import { gql } from "@apollo/client/core";
import { Maybe } from "petal";
import { graphql, GraphQLResponse } from "..";

const query = gql`
  query GetUserTitles($id: Int!) {
    getUserTitle(id: $id) {
      id
      account {
        id
      }
      title {
        title
        description
      }
    }
  }
`;

export async function getUserTitle(id: number) {
  const { data } = (await graphql.query({
    query,
    variables: { id },
  })) as GraphQLResponse<{
    getUserTitle: Maybe<{
      id: number;
      account: {
        id: number;
      };
      title: {
        title: string;
        description: Maybe<string>;
      };
    }>;
  }>;

  return data.getUserTitle;
}
