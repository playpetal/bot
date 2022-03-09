import { gql } from "@apollo/client/core";
import { Payment, Product } from "petal";
import { graphql, GraphQLResponse } from "../..";
import { tokenize } from "../../crypto";

const mutation = gql`
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
  const { data } = (await graphql.mutate({
    mutation,
    variables: { productId: product.id },
    context: { headers: { Authorization: tokenize(discordId) } },
  })) as GraphQLResponse<{
    newTransaction: Payment;
  }>;

  return data.newTransaction;
}
