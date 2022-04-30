import { gql } from "@apollo/client/core";
import { Card } from "petal";
import { tokenize } from "../crypto";
import { mutate } from "../request";

const operation = gql`
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
          title
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
  const data = await mutate<{ rollCards: Card[] }>({
    operation,
    variables: { gender, amount },
    authorization: tokenize(discordId),
  });

  return data.rollCards;
}
