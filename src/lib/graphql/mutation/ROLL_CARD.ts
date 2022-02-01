import { gql } from "@apollo/client/core";
import { graphql, GraphQLResponse, Maybe } from "..";
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
      issue
      quality
      tint
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
    rollCards: {
      id: number;
      prefab: {
        id: number;
        group: Maybe<{ name: string }>;
        subgroup: Maybe<{ name: string }>;
        character: {
          name: string;
        };
      };
      issue: number;
      quality: "SEED" | "SPROUT";
      tint: number;
    }[];
  }>;

  return mutation.data.rollCards;
}
