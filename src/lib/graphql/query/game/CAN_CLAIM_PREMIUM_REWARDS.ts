import { gql } from "@apollo/client/core";
import { graphql, GraphQLResponse } from "../..";
import { tokenize } from "../../../crypto";

const query = gql`
  query CanClaimPremiumRewards {
    canClaimPremiumRewards
  }
`;

export async function canClaimPremiumRewards(
  discordId: string
): Promise<number> {
  const { data } = (await graphql.query({
    query,
    context: { headers: { Authorization: tokenize(discordId) } },
  })) as GraphQLResponse<{
    canClaimPremiumRewards: number;
  }>;

  return data.canClaimPremiumRewards;
}
