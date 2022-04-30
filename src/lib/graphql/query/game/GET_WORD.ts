import { gql } from "@apollo/client/core";
import { tokenize } from "../../crypto";
import { query } from "../../request";

const operation = gql`
  query GetWord {
    word
  }
`;

export async function getWord(discordId: string) {
  const data = await query<{ word: string }>({
    query: operation,
    authorization: tokenize(discordId),
  });

  return data.word;
}
