import { gql } from "@apollo/client/core";
import { Account } from "petal";
import { FLAGS } from "../../../util/flags";
import { tokenize } from "../../crypto";
import { mutate } from "../../request";

const operation = gql`
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
  const data = await mutate<{ toggleFlag: Account }>({
    operation,
    variables: { accountId, flag },
    authorization: tokenize(discordId),
  });

  return data.toggleFlag;
}
