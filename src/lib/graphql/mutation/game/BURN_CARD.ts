import { gql } from "@apollo/client/core";
import { tokenize } from "../../crypto";
import { mutate } from "../../request";

const operation = gql`
  mutation BurnCard($cardId: Int!) {
    burnCard(cardId: $cardId)
  }
`;

export async function burnCard(cardId: number, discordId: string) {
  const data = await mutate<{ burnCard: number }>({
    operation,
    variables: { cardId },
    authorization: tokenize(discordId),
  });

  return data.burnCard;
}
