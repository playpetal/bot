import { gql } from "@apollo/client/core";
import { Card } from "petal";
import { graphql, GraphQLResponse } from "../../..";
import { tokenize } from "../../../crypto";

const mutation = gql`
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
  const { data } = (await graphql.mutate({
    mutation,
    variables: { cardId },
    context: { headers: { Authorization: tokenize(discordId) } },
  })) as GraphQLResponse<{
    setFrame: Card;
  }>;

  return data.setFrame;
}
