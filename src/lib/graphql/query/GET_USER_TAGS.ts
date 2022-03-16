import { gql } from "@apollo/client/core";
import { Tag } from "petal";
import { graphql, GraphQLResponse } from "..";

const query = gql`
  query GetUserTags($id: Int) {
    user(id: $id) {
      id
      tags {
        id
        emoji
        tag
      }
    }
  }
`;

export async function getUserTags(id: number) {
  const { data } = (await graphql.query({
    query,
    variables: { id },
  })) as GraphQLResponse<{
    user: { tags: Tag[] };
  }>;

  return data.user.tags;
}
