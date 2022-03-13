import { gql } from "@apollo/client/core";
import { graphql, GraphQLResponse } from "../..";
import { tokenize } from "../../crypto";

const query = gql`
  query ReachedPurchaseLimit($productId: Int!) {
    reachedPurchaseLimit(productId: $productId)
  }
`;

export async function reachedPurchaseLimit(
  discordId: string,
  productId: number
): Promise<boolean> {
  const { data } = (await graphql.query({
    query,
    variables: { productId },
    context: { headers: { Authorization: tokenize(discordId) } },
  })) as GraphQLResponse<{
    reachedPurchaseLimit: boolean;
  }>;

  return data.reachedPurchaseLimit;
}
