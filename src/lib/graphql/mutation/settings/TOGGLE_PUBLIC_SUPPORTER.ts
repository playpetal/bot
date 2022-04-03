import { gql } from "@apollo/client/core";
import { Account } from "petal";
import { graphql, GraphQLResponse } from "../..";
import { tokenize } from "../../crypto";

const mutation = gql`
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
  const { data } = (await graphql.mutate({
    mutation,
    context: { headers: { Authorization: tokenize(discordId) } },
  })) as GraphQLResponse<{
    togglePublicSupporter: Account;
  }>;

  return data.togglePublicSupporter;
}
