import { gql } from "@apollo/client/core";
import { TitleInventory } from "petal";
import { graphql, GraphQLResponse } from "../..";
import { tokenize } from "../../crypto";

const mutation = gql`
  mutation GrantTitle($accountId: Int!, $titleId: Int!) {
    grantTitle(accountId: $accountId, titleId: $titleId) {
      id
      account {
        id
        username
        discordId
        title {
          title
        }
      }
      title {
        title
      }
    }
  }
`;

export async function grantTitle({
  discordId,
  accountId,
  titleId,
}: {
  discordId: string;
  accountId: number;
  titleId: number;
}): Promise<TitleInventory> {
  const { data } = (await graphql.mutate({
    mutation,
    variables: { accountId, titleId },
    context: { headers: { Authorization: tokenize(discordId) } },
  })) as GraphQLResponse<{
    grantTitle: TitleInventory;
  }>;

  return data.grantTitle;
}
