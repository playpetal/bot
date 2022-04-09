import { gql } from "@apollo/client/core";
import { MinigameType } from "petal";
import { graphql, GraphQLResponse } from "../../..";
import { tokenize } from "../../../crypto";

const operation = gql`
  mutation CompleteMinigame(
    $type: MinigameType!
    $guesses: Int!
    $time: Int!
    $reward: Reward!
  ) {
    completeMinigame(
      type: $type
      guesses: $guesses
      time: $time
      reward: $reward
    )
  }
`;

export async function completeMinigame(
  type: MinigameType,
  senderDiscordId: string,
  guesses: number,
  time: number,
  reward: "CARD" | "PETAL" | "LILY"
) {
  const { data } = (await graphql.mutate({
    mutation: operation,
    variables: { type, guesses, time, reward },
    context: { headers: { Authorization: tokenize(senderDiscordId) } },
  })) as GraphQLResponse<{
    completeIdols: boolean;
  }>;

  return data.completeIdols;
}
