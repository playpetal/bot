import { gql } from "@apollo/client/core";
import { Payment } from "petal";
import { tokenize } from "../../crypto";
import { query } from "../../request";

const operation = gql`
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
  const data = await query<{ payment: Payment }>({
    query: operation,
    variables: { paymentId },
    authorization: tokenize(discordId),
  });

  return data.payment;
}
