import { gql } from "@apollo/client/core";
import { Character, Gender } from "petal";
import { query } from "../../../request";

const operation = gql`
  query GetRandomCharacter($gender: Gender) {
    getRandomCharacter(gender: $gender) {
      id
      name
      birthday
      gender
    }
  }
`;

export async function getRandomCharacter(gender?: Gender): Promise<Character> {
  const data = await query<{
    getRandomCharacter: Character;
  }>({
    query: operation,
    variables: { gender },
  });

  return data.getRandomCharacter;
}
