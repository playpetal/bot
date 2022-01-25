import { gql } from "@apollo/client/core";
import { graphql, GraphQLResponse } from "..";

const GET_GROUPS = gql`
  query GetGroup(
    $id: Int
    $name: String
    $creation: DateTime
    $alias: String
    $after: Int
  ) {
    groups(
      id: $id
      name: $name
      creation: $creation
      alias: $alias
      after: $after
    ) {
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

export async function getGroups({
  id,
  name,
  creation,
  alias,
  after,
}: {
  id?: number;
  name?: string;
  creation?: Date;
  alias?: string;
  after?: number;
}) {
  const query = (await graphql.query({
    query: GET_GROUPS,
    variables: { id, name, creation, alias, after },
  })) as GraphQLResponse<{
    groups: {
      id: number;
      name: string;
      creation: Date;
      gender: "MALE" | "FEMALE" | "COED" | null;
      aliases: { alias: string }[];
    }[];
  }>;

  return query.data.groups;
}
