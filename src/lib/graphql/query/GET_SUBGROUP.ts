import { gql } from "@apollo/client/core";
import { Maybe, Subgroup } from "petal";
import { graphql, GraphQLResponse } from "..";

const query = gql`
  query GetSubgroup($id: Int!) {
    getSubgroup(id: $id) {
      id
      name
      creation
    }
  }
`;

export async function getSubgroup(id: number) {
  const { data } = (await graphql.query({
    query,
    variables: { id },
  })) as GraphQLResponse<{
    getSubgroup: Maybe<Subgroup>;
  }>;

  return data.getSubgroup;
}
