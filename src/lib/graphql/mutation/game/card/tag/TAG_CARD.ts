import { gql } from "@apollo/client/core";
import { Card } from "petal";
import { graphql, GraphQLResponse } from "../../../..";
import { tokenize } from "../../../../crypto";

const mutation = gql`
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
  const { data } = (await graphql.mutate({
    mutation,
    variables: { cardId, tag },
    context: { headers: { Authorization: tokenize(discordId) } },
  })) as GraphQLResponse<{
    tagCard: Card;
  }>;

  return data.tagCard;
}
