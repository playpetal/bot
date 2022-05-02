import { gql } from "@apollo/client/core";
import { Account } from "petal";
import { tokenize } from "../../crypto";
import { mutate } from "../../request";

const operation = gql`
  mutation ToggleMinigamesUseBiasList {
    toggleMinigamesUseBiasList {
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

export async function toggleMinigamesUseBiasList(
  discordId: string
): Promise<Account> {
  const data = await mutate<{ toggleMinigamesUseBiasList: Account }>({
    operation,
    authorization: tokenize(discordId),
  });

  return data.toggleMinigamesUseBiasList;
}
