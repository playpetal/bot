import { gql } from "@apollo/client/core";
import { Maybe, Subgroup } from "petal";
import { query } from "../request";

const operation = gql`
  query GetSubgroup($id: Int!) {
    getSubgroup(id: $id) {
      id
      name
      creation
    }
  }
`;

export async function getSubgroup(id: number) {
  const data = await query<{
    getSubgroup: Maybe<Subgroup>;
  }>({ query: operation, variables: { id } });

  return data.getSubgroup;
}
