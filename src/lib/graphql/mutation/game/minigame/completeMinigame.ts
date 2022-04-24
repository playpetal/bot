import { gql } from "@apollo/client/core";
import { MinigameType } from "petal";
import { tokenize } from "../../../crypto";
import { mutate } from "../../../request";

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
  const data = await mutate<{ completeIdols: boolean }>({
    operation,
    variables: { type, guesses, time, reward },
    authorization: tokenize(senderDiscordId),
  });

  return data.completeIdols;
}
