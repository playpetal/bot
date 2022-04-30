import { gql } from "@apollo/client/core";
import { Card } from "petal";
import { tokenize } from "../../../crypto";
import { mutate } from "../../../request";

const operation = gql`
  mutation ChangeCardColor($cardId: Int!, $color: Int!) {
    changeCardColor(cardId: $cardId, color: $color) {
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

export async function changeCardColor(
  discordId: string,
  cardId: number,
  color: number
) {
  const data = await mutate<{ changeCardColor: Card }>({
    operation,
    variables: { cardId, color },
    authorization: tokenize(discordId),
  });

  return data.changeCardColor;
}
