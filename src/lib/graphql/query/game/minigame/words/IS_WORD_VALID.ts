import { gql } from "@apollo/client/core";
import { query } from "../../../../request";

const operation = gql`
  query isWordValid($word: String!) {
    isWordValid(word: $word)
  }
`;

export async function isWordValid(word: string) {
  const data = await query<{ isWordValid: boolean }>({
    query: operation,
    variables: { word },
  });

  return data.isWordValid;
}
