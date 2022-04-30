import { gql } from "@apollo/client/core";
import { Card } from "petal";
import { tokenize } from "../../../../crypto";
import { mutate } from "../../../../request";

const operation = gql`
  mutation TagCard($cardId: Int!, $tag: String!) {
    tagCard(cardId: $cardId, tag: $tag) {
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
      tag {
        tag
        emoji
      }
    }
  }
`;

export async function tagCard(
  discordId: string,
  cardId: number,
  tag: string
): Promise<Card> {
  const data = await mutate<{ tagCard: Card }>({
    operation,
    variables: { cardId, tag },
    authorization: tokenize(discordId),
  });

  return data.tagCard;
}
