import { gql } from "@apollo/client/core";
import { graphql, GraphQLResponse } from "../..";
import { tokenize } from "../../crypto";

const mutation = gql`
  mutation GrantAllTitle($titleId: Int!) {
    grantAllTitle(titleId: $titleId)
  }
`;

export async function grantAllTitle({
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
    grantAllTitle: number;
  }>;

  return data.grantAllTitle;
}
