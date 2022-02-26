import { gql } from "@apollo/client/core";
import { graphql, GraphQLResponse } from "../../../..";
import { tokenize } from "../../../../../crypto";

const mutation = gql`
  mutation CompleteWords($words: Int!, $time: Int!, $reward: Reward!) {
    completeWords(words: $words, time: $time, reward: $reward)
  }
`;

export async function completeWords(
  senderDiscordId: string,
  words: number,
  time: number,
  reward: "CARD" | "PETAL" | "LILY"
) {
  const { data } = (await graphql.mutate({
    mutation: mutation,
    variables: { words, time, reward },
    context: { headers: { Authorization: tokenize(senderDiscordId) } },
  })) as GraphQLResponse<{
    completeWords: boolean;
  }>;

  return data.completeWords;
}
