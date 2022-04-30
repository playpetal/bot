import { gql } from "@apollo/client/core";
import { Account } from "petal";
import { tokenize } from "../../crypto";
import { mutate } from "../../request";

const operation = gql`
  mutation TogglePublicSupporter {
    togglePublicSupporter {
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

export async function togglePublicSupporter(
  discordId: string
): Promise<Account> {
  const data = await mutate<{ togglePublicSupporter: Account }>({
    operation,
    authorization: tokenize(discordId),
  });

  return data.togglePublicSupporter;
}
