import { gql } from "@apollo/client/core";
import { PartialUser } from "petal";
import { tokenize } from "../../../crypto";
import { mutate } from "../../../request";

const operation = gql`
  mutation CancelMinigame {
    cancelMinigame
  }
`;

export async function cancelMinigame(account: PartialUser) {
  const data = await mutate<{ cancelMinigame: boolean }>({
    operation,
    authorization: tokenize(account.discordId),
  });

  return data.cancelMinigame;
}
