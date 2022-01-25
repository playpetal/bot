import { gql } from "@apollo/client/core";
import { graphql, GraphQLResponse } from "..";
import { tokenize } from "../../crypto";

const CREATE_CHARACTER = gql`
  mutation CreateCharacter(
    $name: String!
    $birthday: DateTime
    $gender: Gender
  ) {
    createCharacter(name: $name, birthday: $birthday, gender: $gender) {
      id
      name
      birthday
      gender
    }
  }
`;

export async function createCharacter(
  discordId: string,
  name: String,
  birthday?: Date,
  gender?: "MALE" | "FEMALE" | "NONBINARY"
) {
  const mutation = (await graphql.mutate({
    mutation: CREATE_CHARACTER,
    variables: { name, birthday, gender },
    context: { headers: { Authorization: tokenize(discordId) } },
  })) as GraphQLResponse<{
    createCharacter: {
      id: number;
      name: string;
      birthday: Date | null;
      gender: "MALE" | "FEMALE" | "NONBINARY" | null;
    };
  }>;

  return mutation.data.createCharacter;
}
