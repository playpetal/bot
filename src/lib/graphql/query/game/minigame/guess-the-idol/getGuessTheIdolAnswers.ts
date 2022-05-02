import { gql } from "@apollo/client/core";
import { Character, PartialUser } from "petal";
import { tokenize } from "../../../../crypto";
import { query } from "../../../../request";

const operation = gql`
  query GetGuessTheIdolAnswers($search: String!) {
    getGuessTheIdolAnswers(search: $search) {
      id
      name
      birthday
      gender
    }
  }
`;

export async function getGuessTheIdolAnswers(
  account: PartialUser,
  search: string
): Promise<Character[]> {
  const data = await query<{ getGuessTheIdolAnswers: Character[] }>({
    query: operation,
    authorization: tokenize(account.discordId),
    variables: { search },
  });

  return data.getGuessTheIdolAnswers;
}
