import { gql } from "@apollo/client/core";
import { Card } from "petal";
import { tokenize } from "../../../crypto";
import { mutate } from "../../../request";

const operation = gql`
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
  const data = await mutate<{ claimMinigameCardReward: Card[] }>({
    operation,
    authorization: tokenize(senderDiscordId),
  });

  return data.claimMinigameCardReward;
}
