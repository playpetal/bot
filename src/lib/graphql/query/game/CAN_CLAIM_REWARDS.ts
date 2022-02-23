import { gql } from "@apollo/client/core";
import { graphql, GraphQLResponse } from "../..";
import { tokenize } from "../../../crypto";

const query = gql`
  query CanClaimRewards {
    canClaimRewards
  }
`;

export async function canClaimRewards(discordId: string): Promise<number> {
  const { data } = (await graphql.query({
    query,
    context: { headers: { Authorization: tokenize(discordId) } },
  })) as GraphQLResponse<{
    canClaimRewards: number;
  }>;

  return data.canClaimRewards;
}
