import { gql } from "@apollo/client/core";
import { Subgroup } from "petal";
import { tokenize } from "../crypto";
import { mutate } from "../request";

const operation = gql`
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
  const data = await mutate<{ createSubgroup: Subgroup }>({
    operation,
    variables: { name, creation },
    authorization: tokenize(discordId),
  });

  return data.createSubgroup;
}
