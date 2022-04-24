import { gql } from "@apollo/client/core";
import { Group } from "petal";
import { tokenize } from "../crypto";
import { mutate } from "../request";

const operation = gql`
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
  const data = await mutate<{ createGroup: Group }>({
    operation,
    variables: { name, creation, gender },
    authorization: tokenize(discordId),
  });

  return data.createGroup;
}
