import { gql } from "@apollo/client/core";
import { query } from "../../../../request";

const operation = gql`
  query IsEmoji($emoji: String!) {
    isEmoji(emoji: $emoji)
  }
`;

export async function isEmoji(emoji: string): Promise<boolean> {
  const data = await query<{ isEmoji: boolean }>({
    query: operation,
    variables: { emoji },
  });

  return data.isEmoji;
}
