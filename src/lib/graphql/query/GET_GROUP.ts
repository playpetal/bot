import { gql } from "@apollo/client/core";
import { Group, Maybe } from "petal";
import { graphql, GraphQLResponse } from "..";

const query = gql`
  query GetGroup($id: Int!) {
    getGroup(id: $id) {
      id
      name
      creation
      gender
      aliases {
        alias
      }
    }
  }
`;

export async function getGroup(id: number) {
  const { data } = (await graphql.query({
    query,
    variables: { id },
  })) as GraphQLResponse<{
    getGroup: Maybe<Group>;
  }>;

  return data.getGroup;
}
