import { gql } from "@apollo/client/core";
import { graphql, GraphQLResponse } from "../..";
import { tokenize } from "../../crypto";

const mutation = gql`
  mutation RevokeAllTitle($titleId: Int!) {
    revokeAllTitle(titleId: $titleId)
  }
`;

export async function revokeAllTitle({
  discordId,
  titleId,
}: {
  discordId: string;
  titleId: number;
}): Promise<number> {
  const { data } = (await graphql.mutate({
    mutation,
    variables: { titleId },
    context: { headers: { Authorization: tokenize(discordId) } },
  })) as GraphQLResponse<{
    revokeAllTitle: number;
  }>;

  return data.revokeAllTitle;
}
