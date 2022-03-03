import { gql } from "@apollo/client/core";
import { graphql, GraphQLResponse } from "..";
import { tokenize } from "../crypto";

const CREATE_GROUP = gql`
  mutation CreateGroup(
    $name: String!
    $creation: DateTime
    $gender: GroupGender
  ) {
    createGroup(name: $name, creation: $creation, gender: $gender) {
      id
      name
      creation
      gender
    }
  }
`;

export async function createGroup(
  discordId: string,
  name: String,
  creation?: Date,
  gender?: "MALE" | "FEMALE" | "COED"
) {
  const mutation = (await graphql.mutate({
    mutation: CREATE_GROUP,
    variables: { name, creation, gender },
    context: { headers: { Authorization: tokenize(discordId) } },
  })) as GraphQLResponse<{
    createGroup: {
      id: number;
      name: string;
      creation: Date | null;
      gender: "MALE" | "FEMALE" | "COED" | null;
    };
  }>;

  return mutation.data.createGroup;
}
