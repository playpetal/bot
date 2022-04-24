import { gql } from "@apollo/client/core";
import { Group, Maybe } from "petal";
import { query } from "../request";

const operation = gql`
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
  const data = await query<{ getGroup: Maybe<Group> }>({
    query: operation,
    variables: { id },
  });

  return data.getGroup;
}
