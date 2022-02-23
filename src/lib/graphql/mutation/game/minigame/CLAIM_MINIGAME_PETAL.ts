import { gql } from "@apollo/client/core";
import { graphql, GraphQLResponse } from "../../..";
import { tokenize } from "../../../../crypto";

const CLAIM_MINIGAME_PETAL_REWARD = gql`
  mutation ClaimMinigamePetalReward {
    claimMinigamePetalReward {
      currency
    }
  }
`;

export async function claimMinigamePetalReward(senderDiscordId: string) {
  const mutation = (await graphql.mutate({
    mutation: CLAIM_MINIGAME_PETAL_REWARD,
    context: { headers: { Authorization: tokenize(senderDiscordId) } },
  })) as GraphQLResponse<{
    claimMinigamePetalReward: { currency: number };
  }>;

  return mutation.data.claimMinigamePetalReward.currency;
}
