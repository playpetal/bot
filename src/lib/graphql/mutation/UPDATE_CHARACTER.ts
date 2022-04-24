import { gql } from "@apollo/client/core";
import { Character } from "petal";
import { tokenize } from "../crypto";
import { mutate } from "../request";

const operation = gql`
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
  const data = await mutate<{ updateCharacter: Character }>({
    operation,
    variables: { id, name, birthday, gender },
    authorization: tokenize(discordId),
  });

  return data.updateCharacter;
}
