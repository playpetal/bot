import { gql } from "@apollo/client/core";
import { Card } from "petal";
import { tokenize } from "../../../crypto";
import { mutate } from "../../../request";

const operation = gql`
  mutation SetFrame($cardId: Int!) {
    setFrame(cardId: $cardId) {
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

export async function setFrame(
  discordId: string,
  cardId: number
): Promise<Card> {
  const data = await mutate<{ setFrame: Card }>({
    operation,
    variables: { cardId },
    authorization: tokenize(discordId),
  });

  return data.setFrame;
}
