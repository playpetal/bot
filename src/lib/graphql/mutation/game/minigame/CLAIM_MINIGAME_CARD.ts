import { gql } from "@apollo/client/core";
import { Card } from "petal";
import { graphql, GraphQLResponse } from "../../..";
import { tokenize } from "../../../crypto";

const CLAIM_MINIGAME_CARD_REWARD = gql`
  mutation ClaimMinigameCardReward {
    claimMinigameCardReward {
      id
      prefab {
        id
        character {
          name
        }
        subgroup {
          name
        }
        group {
          name
        }
      }
      owner {
        id
        username
        title {
          title
        }
      }
      issue
      quality
      tint
      createdAt
      hasFrame
    }
  }
`;

export async function claimMinigameCardReward(senderDiscordId: string) {
  const mutation = (await graphql.mutate({
    mutation: CLAIM_MINIGAME_CARD_REWARD,
    context: { headers: { Authorization: tokenize(senderDiscordId) } },
  })) as GraphQLResponse<{
    claimMinigameCardReward: Card[];
  }>;

  return mutation.data.claimMinigameCardReward;
}
