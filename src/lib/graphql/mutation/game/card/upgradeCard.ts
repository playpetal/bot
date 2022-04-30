import { gql } from "@apollo/client/core";
import { Card } from "petal";
import { tokenize } from "../../../crypto";
import { mutate } from "../../../request";

const operation = gql`
  mutation UpgradeCard($cardId: Int!, $fodderCardId: Int!) {
    upgradeCard(cardId: $cardId, fodderCardId: $fodderCardId) {
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

export async function upgradeCard(
  discordId: string,
  cardId: number,
  fodderCardId: number
): Promise<Card> {
  const data = await mutate<{ upgradeCard: Card }>({
    operation,
    variables: { cardId, fodderCardId },
    authorization: tokenize(discordId),
  });

  return data.upgradeCard;
}
