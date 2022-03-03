import { gql } from "@apollo/client/core";
import { Card } from "petal";
import { graphql, GraphQLResponse } from "../../..";
import { tokenize } from "../../../crypto";

const mutation = gql`
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
  const { data } = (await graphql.mutate({
    mutation,
    variables: { cardId, color },
    context: { headers: { Authorization: tokenize(discordId) } },
  })) as GraphQLResponse<{
    changeCardColor: Card;
  }>;

  return data.changeCardColor;
}
