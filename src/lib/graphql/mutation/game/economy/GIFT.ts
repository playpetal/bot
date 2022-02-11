import { gql } from "@apollo/client/core";
import { graphql, GraphQLResponse } from "../../..";
import { tokenize } from "../../../../crypto";

const mutation = gql`
  mutation Gift($recipientId: Int!, $petals: Int, $cards: [Int!]) {
    gift(recipientId: $recipientId, petals: $petals, cardIds: $cards)
  }
`;

export async function gift(
  discordId: string,
  recipientId: number,
  petals?: number,
  cards?: number[]
) {
  const { data } = (await graphql.mutate({
    mutation,
    variables: { recipientId, petals, cards },
    context: { headers: { Authorization: tokenize(discordId) } },
  })) as GraphQLResponse<{
    gift: boolean;
  }>;

  return data.gift;
}
