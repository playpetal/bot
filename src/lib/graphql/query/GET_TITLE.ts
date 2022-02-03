import { gql } from "@apollo/client/core";
import { Maybe, Title } from "petal";
import { graphql, GraphQLResponse } from "..";

const query = gql`
  query GetTitle($id: Int!) {
    title(id: $id) {
      id
      title
      description
      ownedCount
    }
  }
`;

export async function getTitle(id: number) {
  const { data } = (await graphql.query({
    query,
    variables: { id },
  })) as GraphQLResponse<{
    title: Maybe<Title>;
  }>;

  return data.title;
}
