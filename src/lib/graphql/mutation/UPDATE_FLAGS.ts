import { gql } from "@apollo/client/core";
import { graphql, GraphQLResponse } from "..";
import { tokenize } from "../crypto";

const mutation = gql`
  mutation UpdateFlags($flags: Int!) {
    updateFlags(flags: $flags)
  }
`;

export async function updateFlags(discordId: string, flags: number) {
  const { data } = (await graphql.mutate({
    mutation,
    variables: { flags },
    context: { headers: { Authorization: tokenize(discordId) } },
  })) as GraphQLResponse<{
    updateFlags: number;
  }>;

  return data.updateFlags;
}
