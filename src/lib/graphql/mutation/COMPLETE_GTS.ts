import { gql } from "@apollo/client/core";
import { graphql, GraphQLResponse } from "..";
import { tokenize } from "../../crypto";

const COMPLETE_GTS = gql`
  mutation CompleteGTS(
    $guesses: Int!
    $time: Int!
    $reward: Int!
    $songId: Int!
    $correct: Boolean!
    $startedAt: DateTime!
  ) {
    completeGts(
      guesses: $guesses
      correct: $correct
      reward: $reward
      songId: $songId
      startedAt: $startedAt
      time: $time
    )
  }
`;

export async function completeGts(
  senderDiscordId: string,
  guesses: number,
  time: number,
  reward: number,
  songId: number,
  correct: boolean,
  startedAt: number
) {
  const mutation = (await graphql.mutate({
    mutation: COMPLETE_GTS,
    variables: { guesses, time, reward, songId, correct, startedAt },
    context: { headers: { Authorization: tokenize(senderDiscordId) } },
  })) as GraphQLResponse<{
    completeGts: number;
  }>;

  return mutation.data.completeGts;
}
