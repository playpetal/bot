import { gql } from "@apollo/client/core";
import { graphql, GraphQLResponse } from "../..";
import { tokenize } from "../../crypto";

const mutation = gql`
  mutation BurnCard($cardId: Int!) {
    burnCard(cardId: $cardId)
  }
`;

export async function burnCard(cardId: number, discordId: string) {
  const { data } = (await graphql.mutate({
    mutation,
    variables: { cardId },
    context: { headers: { Authorization: tokenize(discordId) } },
  })) as GraphQLResponse<{
    burnCard: number;
  }>;

  return data.burnCard;
}
