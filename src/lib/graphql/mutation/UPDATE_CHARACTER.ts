import { gql } from "@apollo/client/core";
import { graphql, GraphQLResponse } from "..";
import { tokenize } from "../crypto";

const UPDATE_CHARACTER = gql`
  mutation UpdateCharacter(
    $id: Int!
    $name: String
    $birthday: DateTime
    $gender: Gender
  ) {
    updateCharacter(
      id: $id
      name: $name
      birthday: $birthday
      gender: $gender
    ) {
      id
      name
      birthday
      gender
    }
  }
`;

export async function updateCharacter(
  discordId: string,
  id: number,
  name?: String,
  birthday?: Date | null,
  gender?: "MALE" | "FEMALE" | "NONBINARY" | null
) {
  const mutation = (await graphql.mutate({
    mutation: UPDATE_CHARACTER,
    variables: { id, name, birthday, gender },
    context: { headers: { Authorization: tokenize(discordId) } },
  })) as GraphQLResponse<{
    updateCharacter: {
      id: number;
      name: string;
      birthday: Date | null;
      gender: "MALE" | "FEMALE" | "NONBINARY" | null;
    };
  }>;

  return mutation.data.updateCharacter;
}
