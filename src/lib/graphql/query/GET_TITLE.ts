import { gql } from "@apollo/client/core";
import { Maybe, Title } from "petal";
import { graphql, GraphQLResponse } from "..";

const query = gql`
  query GetTitle($id: Int, $title: String) {
    title(id: $id, title: $title) {
      id
      title
      description
      ownedCount
    }
  }
`;

export async function getTitle({
  id,
  title,
}: {
  id?: number;
  title?: string;
}): Promise<Maybe<Title>> {
  const { data } = (await graphql.query({
    query,
    variables: { id, title },
  })) as GraphQLResponse<{
    title: Maybe<Title>;
  }>;

  return data.title;
}
