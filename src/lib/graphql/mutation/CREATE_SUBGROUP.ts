import { gql } from "@apollo/client/core";
import { graphql, GraphQLResponse } from "..";
import { tokenize } from "../crypto";

const CREATE_SUBGROUP = gql`
  mutation CreateSubgroup($name: String!, $creation: DateTime) {
    createSubgroup(name: $name, creation: $creation) {
      id
      name
      creation
    }
  }
`;

export async function createSubgroup(
  discordId: string,
  name: String,
  creation?: Date
) {
  const mutation = (await graphql.mutate({
    mutation: CREATE_SUBGROUP,
    variables: { name, creation },
    context: { headers: { Authorization: tokenize(discordId) } },
  })) as GraphQLResponse<{
    createSubgroup: {
      id: number;
      name: string;
      creation: Date | null;
    };
  }>;

  return mutation.data.createSubgroup;
}
