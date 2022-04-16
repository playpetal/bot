import { gql } from "@apollo/client/core";
import { Card } from "petal";
import { graphql, GraphQLResponse } from "../../..";
import { tokenize } from "../../../crypto";

const mutation = gql`
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
  const { data } = (await graphql.mutate({
    mutation,
    variables: { cardId, fodderCardId },
    context: { headers: { Authorization: tokenize(discordId) } },
  })) as GraphQLResponse<{
    upgradeCard: Card;
  }>;

  return data.upgradeCard;
}
