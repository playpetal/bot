import { gql } from "@apollo/client/core";
import { Subgroup } from "petal";
import { tokenize } from "../crypto";
import { mutate } from "../request";

const operation = gql`
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
  const data = await mutate<{ updateSubgroup: Subgroup }>({
    operation,
    variables: { id, name, creation },
    authorization: tokenize(discordId),
  });

  return data.updateSubgroup;
}
