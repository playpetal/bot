import { gql } from "@apollo/client/core";
import { graphql, GraphQLResponse } from "../../..";
import { tokenize } from "../../../../crypto";

const mutation = gql`
  mutation Gift(
    $recipientId: Int!
    $petals: Int
    $cards: [Int!]
    $lilies: Int
  ) {
    gift(
      recipientId: $recipientId
      petals: $petals
      cardIds: $cards
      lilies: $lilies
    )
  }
`;

export async function gift({
  discordId,
  recipientId,
  petals,
  cards,
  lilies,
}: {
  discordId: string;
  recipientId: number;
  petals?: number;
  cards?: number[];
  lilies?: number;
}) {
  const { data } = (await graphql.mutate({
    mutation,
    variables: { recipientId, petals, cards, lilies },
    context: { headers: { Authorization: tokenize(discordId) } },
  })) as GraphQLResponse<{
    gift: boolean;
  }>;

  return data.gift;
}
