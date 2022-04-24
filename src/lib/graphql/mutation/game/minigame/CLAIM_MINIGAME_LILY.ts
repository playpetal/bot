import { gql } from "@apollo/client/core";
import { tokenize } from "../../../crypto";
import { mutate } from "../../../request";

const operation = gql`
  mutation ClaimMinigameLilyReward {
    claimMinigameLilyReward {
      premiumCurrency
    }
  }
`;

export async function claimMinigameLilyReward(senderDiscordId: string) {
  const data = await mutate<{
    claimMinigameLilyReward: { premiumCurrency: number };
  }>({ operation, authorization: tokenize(senderDiscordId) });

  return data.claimMinigameLilyReward.premiumCurrency;
}
