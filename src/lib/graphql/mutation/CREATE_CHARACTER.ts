import { gql } from "@apollo/client/core";
import { Character } from "petal";
import { tokenize } from "../crypto";
import { mutate } from "../request";

const operation = gql`
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
  const data = await mutate<{ createCharacter: Character }>({
    operation,
    variables: { name, birthday, gender },
    authorization: tokenize(discordId),
  });

  return data.createCharacter;
}
