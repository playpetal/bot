import { gql } from "@apollo/client/core";
import { tokenize } from "../../../crypto";
import { mutate } from "../../../request";

const operation = gql`
  mutation ClaimMinigamePetalReward {
    claimMinigamePetalReward {
      currency
    }
  }
`;

export async function claimMinigamePetalReward(senderDiscordId: string) {
  const data = await mutate<{ claimMinigamePetalReward: { currency: number } }>(
    { operation, authorization: tokenize(senderDiscordId) }
  );

  return data.claimMinigamePetalReward.currency;
}
