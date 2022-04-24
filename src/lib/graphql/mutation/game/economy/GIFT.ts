import { gql } from "@apollo/client/core";
import { tokenize } from "../../../crypto";
import { mutate } from "../../../request";

const operation = gql`
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
  const data = await mutate<{ gift: boolean }>({
    operation,
    variables: { recipientId, petals, cards, lilies },
    authorization: tokenize(discordId),
  });

  return data.gift;
}
