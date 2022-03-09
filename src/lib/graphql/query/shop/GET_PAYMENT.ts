import { gql } from "@apollo/client/core";
import { Payment, Product } from "petal";
import { graphql, GraphQLResponse } from "../..";
import { tokenize } from "../../crypto";

const query = gql`
  query GetPayment($paymentId: String!) {
    payment(paymentId: $paymentId) {
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

export async function getPayment(
  discordId: string,
  paymentId: string
): Promise<Payment> {
  const { data } = (await graphql.query({
    query,
    variables: { paymentId },
    context: { headers: { Authorization: tokenize(discordId) } },
  })) as GraphQLResponse<{
    payment: Payment;
  }>;

  return data.payment;
}
