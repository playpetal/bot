import { gql } from "@apollo/client/core";
import { Group } from "petal";
import { tokenize } from "../crypto";
import { mutate } from "../request";

const operation = gql`
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
  const data = await mutate<{ updateGroup: Group }>({
    operation,
    variables: { id, name, creation, gender },
    authorization: tokenize(discordId),
  });

  return data.updateGroup;
}
