import { gql } from "@apollo/client/core";
import { Card } from "petal";
import { graphql, GraphQLResponse } from "..";
import { tokenize } from "../../crypto";

const ROLL_CARD = gql`
  mutation RollCards($gender: Gender, $amount: Int!) {
    rollCards(gender: $gender, amount: $amount) {
      id
      prefab {
        id
        group {
          name
        }
        subgroup {
          name
        }
        character {
          name
        }
      }
      owner {
        id
        username
        discordId
        title {
          title {
            title
          }
        }
      }
      issue
      quality
      tint
      createdAt
    }
  }
`;

export async function rollCards(
  discordId: string,
  amount: number,
  gender?: "MALE" | "FEMALE" | "NONBINARY"
) {
  const mutation = (await graphql.mutate({
    mutation: ROLL_CARD,
    variables: { gender, amount },
    context: { headers: { Authorization: tokenize(discordId) } },
  })) as GraphQLResponse<{
    rollCards: Card[];
  }>;

  return mutation.data.rollCards;
}
