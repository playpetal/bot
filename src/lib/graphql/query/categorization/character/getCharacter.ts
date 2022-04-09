import { gql } from "@apollo/client/core";
import { Character, Maybe } from "petal";
import { query } from "../../../request";

const operation = gql`
  query GetCharacter($id: Int!) {
    getCharacter(id: $id) {
      id
      name
      birthday
      gender
    }
  }
`;

export async function getCharacter(id: number): Promise<Maybe<Character>> {
  const data = await query<{
    getCharacter: Maybe<Character>;
  }>({
    query: operation,
    variables: { id },
  });

  return data.getCharacter;
}
