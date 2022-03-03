import { gql } from "@apollo/client/core";
import { graphql, GraphQLResponse } from "../../..";
import { tokenize } from "../../../crypto";

const CLAIM_MINIGAME_LILY_REWARD = gql`
  mutation ClaimMinigameLilyReward {
    claimMinigameLilyReward {
      premiumCurrency
    }
  }
`;

export async function claimMinigameLilyReward(senderDiscordId: string) {
  const mutation = (await graphql.mutate({
    mutation: CLAIM_MINIGAME_LILY_REWARD,
    context: { headers: { Authorization: tokenize(senderDiscordId) } },
  })) as GraphQLResponse<{
    claimMinigameLilyReward: { premiumCurrency: number };
  }>;

  return mutation.data.claimMinigameLilyReward.premiumCurrency;
}
