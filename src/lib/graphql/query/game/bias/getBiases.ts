import { gql } from "@apollo/client/core";
import { Bias, PartialUser } from "petal";
import { query } from "../../../request";

const operation = gql`
  query GetBiases($accountId: Int!) {
    getBiases(accountId: $accountId) {
      account {
        id
        username
        discordId
        title {
          title
        }
      }
      group {
        id
        name
        creation
        gender
        aliases {
          alias
        }
      }
    }
  }
`;

export async function getBiases(account: PartialUser): Promise<Bias[]> {
  const data = await query<{
    getBiases: Bias[];
  }>({
    query: operation,
    variables: { accountId: account.id },
  });

  return data.getBiases;
}
