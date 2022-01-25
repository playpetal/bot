import { gql } from "@apollo/client/core";
import { graphql, GraphQLResponse } from "..";

const GET_SUBGROUPS = gql`
  query GetSubgroups($id: Int, $name: String, $creation: DateTime) {
    subgroups(id: $id, name: $name, creation: $creation) {
      id
      name
      creation
    }
  }
`;

export async function getSubgroups({
  id,
  name,
  creation,
}: {
  id?: number;
  name?: string;
  creation?: Date;
}) {
  const query = (await graphql.query({
    query: GET_SUBGROUPS,
    variables: { id, name, creation },
  })) as GraphQLResponse<{
    subgroups: {
      id: number;
      name: string;
      creation: Date;
    }[];
  }>;

  return query.data.subgroups;
}
