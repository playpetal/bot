import { gql } from "@apollo/client/core";
import { Card, Maybe } from "petal";
import { query } from "../request";

const operation = gql`
  query GetCard($id: Int!) {
    getCard(id: $id) {
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
        flags
      }
      issue
      quality
      tint
      createdAt
      hasFrame
      tag {
        emoji
        tag
      }
    }
  }
`;

export async function getCard(id: number) {
  const data = await query<{ getCard: Maybe<Card> }>({
    query: operation,
    variables: { id },
  });

  return data.getCard;
}
