import { gql } from "@apollo/client/core";
import { graphql, GraphQLResponse } from "../..";
import { tokenize } from "../../crypto";

const mutation = gql`
  mutation RevokeTitle($accountId: Int!, $titleId: Int!) {
    revokeTitle(accountId: $accountId, titleId: $titleId)
  }
`;

export async function revokeTitle({
  discordId,
  accountId,
  titleId,
}: {
  discordId: string;
  accountId: number;
  titleId: number;
}): Promise<number> {
  const { data } = (await graphql.mutate({
    mutation,
    variables: { accountId, titleId },
    context: { headers: { Authorization: tokenize(discordId) } },
  })) as GraphQLResponse<{
    revokeTitle: number;
  }>;

  return data.revokeTitle;
}
