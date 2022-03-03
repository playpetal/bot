import { gql } from "@apollo/client/core";
import { graphql, GraphQLResponse } from "..";
import { tokenize } from "../crypto";

const UPDATE_SUBGROUP = gql`
  mutation UpdateSubgroup($id: Int!, $name: String, $creation: DateTime) {
    updateSubgroup(id: $id, name: $name, creation: $creation) {
      id
      name
      creation
    }
  }
`;

export async function updateSubgroup(
  discordId: string,
  id: number,
  name?: String,
  creation?: Date | null
) {
  const mutation = (await graphql.mutate({
    mutation: UPDATE_SUBGROUP,
    variables: { id, name, creation },
    context: { headers: { Authorization: tokenize(discordId) } },
  })) as GraphQLResponse<{
    updateSubgroup: {
      id: number;
      name: string;
      creation: Date | null;
    };
  }>;

  return mutation.data.updateSubgroup;
}
