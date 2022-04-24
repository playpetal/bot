import { gql } from "@apollo/client/core";
import { Payment, Product } from "petal";
import { tokenize } from "../../crypto";
import { mutate } from "../../request";

const operation = gql`
  mutation NewTransaction($productId: Int!) {
    newTransaction(productId: $productId) {
      id
      accountId
      cost
      paymentId
      productId
      success
      url
    }
  }
`;

export async function newTransaction(
  discordId: string,
  product: Product
): Promise<Payment> {
  const data = await mutate<{ newTransaction: Payment }>({
    operation,
    variables: { productId: product.id },
    authorization: tokenize(discordId),
  });

  return data.newTransaction;
}
