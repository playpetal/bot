import { gql } from "@apollo/client/core";
import { graphql, GraphQLResponse } from "..";
import { tokenize } from "../../crypto";

const COMPLETE_GTS = gql`
  mutation CompleteGTS(
    $guesses: Int!
    $time: Int!
    $reward: Int!
    $correct: Boolean!
    $isNewHour: Boolean!
  ) {
    completeGts(
      guesses: $guesses
      correct: $correct
      reward: $reward
      time: $time
      isNewHour: $isNewHour
    )
  }
`;

export async function completeGts(
  senderDiscordId: string,
  guesses: number,
  time: number,
  reward: number,
  correct: boolean,
  isNewHour: boolean
) {
  const mutation = (await graphql.mutate({
    mutation: COMPLETE_GTS,
    variables: { guesses, time, reward, correct, isNewHour },
    context: { headers: { Authorization: tokenize(senderDiscordId) } },
  })) as GraphQLResponse<{
    completeGts: number;
  }>;

  return mutation.data.completeGts;
}
