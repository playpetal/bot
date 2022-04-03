import { gql } from "@apollo/client/core";
import { Account } from "petal";
import { graphql, GraphQLResponse } from "../..";
import { FLAGS } from "../../../util/flags";
import { tokenize } from "../../crypto";

const mutation = gql`
  mutation ToggleFlag($accountId: Int!, $flag: Flag!) {
    toggleFlag(accountId: $accountId, flag: $flag) {
      id
      discordId
      username
      flags
      createdAt
      bio
      currency
      premiumCurrency
      stats {
        cardCount
        rollCount
      }
      title {
        title
      }
    }
  }
`;

export async function toggleFlag(
  discordId: string,
  accountId: number,
  flag: keyof typeof FLAGS
): Promise<Account> {
  const { data } = (await graphql.mutate({
    mutation,
    variables: { accountId, flag },
    context: { headers: { Authorization: tokenize(discordId) } },
  })) as GraphQLResponse<{
    toggleFlag: Account;
  }>;

  return data.toggleFlag;
}
