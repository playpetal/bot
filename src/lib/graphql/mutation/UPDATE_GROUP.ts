import { gql } from "@apollo/client/core";
import { graphql, GraphQLResponse } from "..";
import { tokenize } from "../../crypto";

const UPDATE_GROUP = gql`
  mutation UpdateGroup(
    $id: Int!
    $name: String
    $creation: DateTime
    $gender: GroupGender
  ) {
    updateGroup(id: $id, name: $name, creation: $creation, gender: $gender) {
      id
      name
      creation
      gender
    }
  }
`;

export async function updateGroup(
  discordId: string,
  id: number,
  name?: String,
  creation?: Date | null,
  gender?: "MALE" | "FEMALE" | "COED" | null
) {
  const mutation = (await graphql.mutate({
    mutation: UPDATE_GROUP,
    variables: { id, name, creation, gender },
    context: { headers: { Authorization: tokenize(discordId) } },
  })) as GraphQLResponse<{
    updateGroup: {
      id: number;
      name: string;
      creation: Date | null;
      gender: "MALE" | "FEMALE" | "COED" | null;
    };
  }>;

  return mutation.data.updateGroup;
}
