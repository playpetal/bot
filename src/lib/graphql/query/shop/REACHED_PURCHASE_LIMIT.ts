import { gql } from "@apollo/client/core";
import { tokenize } from "../../crypto";
import { query } from "../../request";

const operation = gql`
  query ReachedPurchaseLimit($productId: Int!) {
    reachedPurchaseLimit(productId: $productId)
  }
`;

export async function reachedPurchaseLimit(
  discordId: string,
  productId: number
): Promise<boolean> {
  const data = await query<{ reachedPurchaseLimit: boolean }>({
    query: operation,
    variables: { productId },
    authorization: tokenize(discordId),
  });

  return data.reachedPurchaseLimit;
}
