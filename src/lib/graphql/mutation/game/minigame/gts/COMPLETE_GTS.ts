import { gql } from "@apollo/client/core";
import { graphql, GraphQLResponse } from "../../../..";
import { tokenize } from "../../../../crypto";

const COMPLETE_GTS = gql`
  mutation CompleteGTS($guesses: Int!, $time: Int!, $reward: Reward!) {
    completeGts(guesses: $guesses, time: $time, reward: $reward)
  }
`;

export async function completeGts(
  senderDiscordId: string,
  guesses: number,
  time: number,
  reward: "CARD" | "PETAL" | "LILY"
) {
  const mutation = (await graphql.mutate({
    mutation: COMPLETE_GTS,
    variables: { guesses, time, reward },
    context: { headers: { Authorization: tokenize(senderDiscordId) } },
  })) as GraphQLResponse<{
    completeGts: boolean;
  }>;

  return mutation.data.completeGts;
}
